import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { PageLoader } from "../components/Spinner";
import Alert from "../components/Alert";
import { updateOrderStatus } from "../api/adminOrders";
export default function AdminOrderDetails() {
  const { id } = useParams();
const [status, setStatus] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    fetchOrder();
  }, []);

 const fetchOrder = async () => {
  try {
    const { data } = await api.get(`/api/orders/admin/${id}`);

    console.log(data);

    setOrder(data.order);
    setStatus(data.order.orderStatus);

  } catch (err) {
    setMessage({
      type: "error",
      text: err.response?.data?.message || "Failed to load order",
    });
  } finally {
    setLoading(false);
  }
};
const handleUpdateStatus = async () => {
  try {
    const { data } = await updateOrderStatus(order.id, status);

    setOrder(data.order);
    setStatus(data.order.orderStatus);

    setMessage({
      type: "success",
      text: "Order status updated successfully",
    });
  } catch (err) {
    setMessage({
      type: "error",
      text: err.response?.data?.message || "Failed to update status",
    });
  }
};
  
  if (loading) return <PageLoader />;

  if (!order)
    return (
      <div className="p-6">
        <Alert
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ type: "", text: "" })}
        />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
<Alert
  type={message.type}
  message={message.text}
  onClose={() => setMessage({ type: "", text: "" })}
/>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Customer</h2>

        <p><strong>Name:</strong> {order.user?.name}</p>
        <p><strong>Email:</strong> {order.user?.email}</p>

       <p className="mt-4">
  <strong>Status:</strong> {order.orderStatus}
</p>

<p>
  <strong>Payment:</strong> {order.paymentStatus}
</p>

<p>
  <strong>Total:</strong> ₹{order.totalAmount}
</p>
      </div>
<div className="bg-white rounded-lg shadow p-6 mb-6">
  <h2 className="text-xl font-semibold mb-4">
    Update Status
  </h2>

  <div className="flex gap-4 items-center">

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="border rounded px-4 py-2"
    >
      <option value="PENDING">Pending</option>
      <option value="CONFIRMED">Confirmed</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>

   <button
  onClick={handleUpdateStatus}
disabled={status === order.orderStatus}
  className={`px-5 py-2 rounded text-white ${
  status === order.orderStatus
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  Save
</button>

  </div>
</div>
            <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Products</h2>

        {(order.items || []).length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          (order.items || []).map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b py-3"
            >
              <div>
                <p className="font-medium">
                  {item.product?.name || "Product"}
                </p>

                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p>₹{item.price}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}