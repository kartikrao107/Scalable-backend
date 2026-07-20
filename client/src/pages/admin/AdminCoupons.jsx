import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const loadCoupons = async () => {
    try {
      const res = await api.get("/api/coupon/getCoupons");
      setCoupons(res.data.coupons);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/coupon/createCoupon", {
        code,
        discount: Number(discount),
        expiryDate,
      });

      setCode("");
      setDiscount("");
      setExpiryDate("");

      loadCoupons();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/coupon/${id}`);
      loadCoupons();
    } catch (err) {
      console.error(err);
    }
  };return (
  <div className="container mt-4">
    <h2 className="mb-4">Manage Coupons</h2>

    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <div className="mb-3">
        <label className="form-label">Coupon Code</label>
        <input
          type="text"
          className="form-control"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. SAVE20"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Discount (%)</label>
        <input
          type="number"
          className="form-control"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Expiry Date</label>
        <input
          type="date"
          className="form-control"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
      </div>

      <button className="btn btn-primary">
        Create Coupon
      </button>
    </form>

    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Code</th>
          <th>Discount</th>
          <th>Expiry</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {coupons.map((coupon) => (
          <tr key={coupon.id}>
            <td>{coupon.code}</td>
            <td>{coupon.discount}%</td>
            <td>
              {new Date(coupon.expiryDate).toLocaleDateString()}
            </td>
            <td>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(coupon.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}