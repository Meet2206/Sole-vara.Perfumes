import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const Invoice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const invoiceData = location.state;

  if (!invoiceData) {
    return (
      <div className="p-16 text-center">
        <h2 className="text-lg font-semibold mb-4">No Invoice Data Found</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const doc = new jsPDF("p", "pt", "a4");

      // Create image element for invoice template
      const img = new Image();
      img.src = import.meta.env.BASE_URL + "invoice-template.png";

      img.onload = () => {
        // Draw background image
        doc.addImage(img, "PNG", 0, 0, 595, 842);

        // GST calculation
        const gstRate = invoiceData.gstRate ?? 0.18;
        const subTotal = invoiceData.totalPrice;
        const tax = subTotal * gstRate;
        const grandTotal = subTotal + tax;

        // Use a font that supports ₹ symbol
        doc.setFont("times", "normal");
        doc.setFontSize(11);

        // Header
        doc.text(invoiceData.customerName, 90, 140);
        doc.text(`#${invoiceData.invoiceNo || "0001"}`, 400, 140);
        doc.text(new Date().toLocaleDateString(), 400, 160);

        // Products
        let y = 290;
        invoiceData.cart.forEach((item: any) => {
          doc.text(item.name, 60, y);
          doc.text(String(item.quantity), 260, y);
          doc.text(`₹${item.price.toLocaleString()}`, 360, y);
          doc.text(`₹${(item.price * item.quantity).toLocaleString()}`, 460, y);
          y += 30;
        });

        // Totals
        doc.text(`₹${subTotal.toLocaleString()}`, 500, 470, { align: "right" });
        doc.text(`₹${tax.toLocaleString()}`, 500, 490, { align: "right" });
        doc.setFont("times", "bold");
        doc.text(`₹${grandTotal.toLocaleString()}`, 500, 520, { align: "right" });

        // Save PDF
        doc.save("invoice.pdf");
      };

      img.onerror = (err) => {
        console.error("Error loading invoice template image:", err);
      };
    } catch (err) {
      console.error("Error generating invoice:", err);
    }
  };

  return (
    <div className="p-16 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-4">
        Solévara FRAGRANCES
      </h1>
      <p className="text-center mb-6">
        Invoice Date: {new Date().toLocaleDateString()}
      </p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Customer Details</h2>
        <p><strong>Name:</strong> {invoiceData.customerName}</p>
        <p><strong>Email:</strong> {invoiceData.email}</p>
        <p><strong>Phone:</strong> {invoiceData.phone}</p>
      </div>

      <table className="w-full border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Price</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.cart.map((item: any) => (
            <tr key={item.id}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">
                ₹{(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-lg font-semibold text-right mb-6">
        Subtotal: ₹{invoiceData.totalPrice.toLocaleString()} <br />
        GST (18%): ₹{(invoiceData.totalPrice * 0.18).toLocaleString()} <br />
        <span className="font-bold">
          Total: ₹{(invoiceData.totalPrice * 1.18).toLocaleString()}
        </span>
      </h2>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Home
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default Invoice;
