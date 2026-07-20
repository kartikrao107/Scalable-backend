import { useEffect, useState } from "react";
import { getAllOrders } from "../api/adminOrders";
import { PageLoader } from "../components/Spinner";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const loadOrders = async () => {
    try {
      const { data } = await getAllOrders();
      console.log(data);
      setOrders(data.Orders);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load orders",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) return <PageLoader />;

  
return (
  <div className="max-w-7xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

    <Alert
      type={message.type}
      message={message.text}
      onClose={() =>
        setMessage({
          type: "",
          text: "",
        })
      }
    />

    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Actions</th>
            <th className="px-4 py-3 text-left">Order ID</th>
            <th className="px-4 py-3 text-left">Customer</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Payment</th>
            <th className="px-4 py-3 text-left">Items</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center py-6"
              >
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50"
              ><td className="px-4 py-3">
    <Link
        to={`/admin/orders/${order.id}`}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
    >
        View
    </Link>
</td>
                <td className="px-4 py-3">
                  {order.id.slice(0, 8)}...
                </td>

                <td className="px-4 py-3">
                  {order.user?.name}
                </td>

                <td className="px-4 py-3">
                  ₹{order.totalAmount}
                </td>

                <td className="px-4 py-3">
                 {order.orderStatus}
                </td>

                <td className="px-4 py-3">
                  {order.paymentStatus}
                </td>

                <td className="px-4 py-3">
                  {order.items?.length || 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);  

}