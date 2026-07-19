const { Prisma } = require("../config/db");

const placeOrderService = async (userId, body) => {

    const { addressId, couponCode } = body;

    const cart = await Prisma.cart.findUnique({

        where: {

            userId

        },

        include: {

            items: {

                include: {

                    product: true

                }

            }

        }

    });

    if (!cart || cart.items.length === 0) {

        throw new Error("Cart is empty");

    }

    const address = await Prisma.address.findUnique({

        where: {

            id: addressId

        }

    });

    if (!address || address.userId !== userId) {

        throw new Error("Invalid address");

    }

    let discount = 0;

    if (couponCode) {

        const coupon = await Prisma.coupon.findUnique({

            where: {

                code: couponCode

            }

        });

        if (!coupon) {

            throw new Error("Coupon not found");

        }

        if (!coupon.isActive) {

            throw new Error("Coupon inactive");

        }

        if (new Date() > coupon.expiryDate) {

            throw new Error("Coupon expired");

        }

        discount = coupon.discount;

    }

    let total = 0;

    for (const item of cart.items) {

        if (item.quantity > item.product.stock) {

            throw new Error(`${item.product.name} is out of stock`);

        }

        total += item.quantity * item.product.price;

    }

    total = total - (total * discount / 100);

    return await Prisma.$transaction(async (tx) => {

        const order = await tx.order.create({

            data: {

                totalAmount: total,

                userId

            }

        });

        for (const item of cart.items) {

            await tx.orderItem.create({

                data: {

                    orderId: order.id,

                    productId: item.productId,

                    quantity: item.quantity,

                    price: item.product.price

                }

            });

            await tx.product.update({

                where: {

                    id: item.productId

                },

                data: {

                    stock: {

                        decrement: item.quantity

                    }

                }

            });

        }

        await tx.cartItem.deleteMany({

            where: {

                cartId: cart.id

            }

        });

        return order;

    });

};

const getOrdersService = async (userId) => {

    return await Prisma.order.findMany({

        where: {

            userId

        },

        include: {

            items: {

                include: {

                    product: true

                }

            }

        },

        orderBy: {

            createdAt: "desc"

        }

    });

};

const getOrderService = async (userId, id) => {

    const order = await Prisma.order.findUnique({

        where: {

            id

        },

        include: {

            items: {

                include: {

                    product: true

                }

            }

        }

    });

    if (!order) {

        throw new Error("Order not found");

    }

    if (order.userId !== userId) {

        throw new Error("Unauthorized");

    }

    return order;

};

const cancelOrderService = async (userId, id) => {

    const order = await Prisma.order.findUnique({

        where: {

            id

        },

        include: {

            items: true

        }

    });

    if (!order) {

        throw new Error("Order not found");

    }

    if (order.userId !== userId) {

        throw new Error("Unauthorized");

    }

    if (order.orderStatus === "CANCELLED") {

        throw new Error("Already cancelled");

    }

    return await Prisma.$transaction(async (tx) => {

        for (const item of order.items) {

            await tx.product.update({

                where: {

                    id: item.productId

                },

                data: {

                    stock: {

                        increment: item.quantity

                    }

                }

            });

        }

        return await tx.order.update({

            where: {

                id

            },

            data: {

                orderStatus: "CANCELLED"

            }

        });

    });

};

module.exports = {

    placeOrderService,

    getOrdersService,

    getOrderService,

    cancelOrderService

};