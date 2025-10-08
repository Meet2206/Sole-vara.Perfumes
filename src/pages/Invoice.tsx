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
      const doc = new jsPDF("p", "mm", "a4");

      // GST calculation
      const gstRate = invoiceData.gstRate ?? 0.18;
      const subTotal = invoiceData.totalPrice;
      const tax = subTotal * gstRate;
      const grandTotal = subTotal + tax;
      const invoiceNo = invoiceData.invoiceNo || `INV-${Date.now().toString().slice(-6)}`;
      const currentDate = new Date().toLocaleDateString();

      // Load the invoice template image
      const templateImg = new Image();
      templateImg.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        templateImg.onload = resolve;
        templateImg.onerror = reject;
        templateImg.src = "/assets/invoice-template copy.png";
      });

      // Add the template as background
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = templateImg.width;
      canvas.height = templateImg.height;
      ctx?.drawImage(templateImg, 0, 0);
      
      const templateDataUrl = canvas.toDataURL('image/png');
      doc.addImage(templateDataUrl, 'PNG', 0, 0, 210, 297);

      // Set font and color for text overlay
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);

      // Customer details (INVOICE TO section) - positioned according to template
      doc.text(invoiceData.customerName || "Customer Name", 40, 240);
      doc.text(invoiceData.email || "customer@email.com", 40, 248);
      doc.text(invoiceData.phone || "Phone Number", 40, 256);
      if (invoiceData.address) {
        // Split long address into multiple lines if needed
        const addressLines = doc.splitTextToSize(invoiceData.address, 80);
        doc.text(addressLines, 40, 264);
      }

      // Invoice details (top right) - positioned according to template
      doc.text(invoiceNo, 170, 352);
      doc.text(currentDate, 170, 388);

      // Product details in the table
      let yPosition = 465; // Starting position for first product row
      invoiceData.cart.forEach((item: any) => {
        // Ensure product name fits in the column
        const itemName = item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name;
        
        // Position according to template columns
        doc.text(itemName, 40, yPosition);                                    // NAME column
        doc.text(String(item.quantity), 470, yPosition);                      // QTY column  
        doc.text(`₹${item.price.toLocaleString()}`, 630, yPosition);          // PRICE column
        doc.text(`₹${(item.price * item.quantity).toLocaleString()}`, 775, yPosition); // TOTAL column
        
        yPosition += 35; // Space between rows according to template
      });

      // Totals section
      doc.text(`₹${subTotal.toLocaleString()}`, 775, 822);  // Sub-total position
      doc.text(`₹${tax.toLocaleString()}`, 775, 873);       // Tax position
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`₹${grandTotal.toLocaleString()}`, 775, 918); // Total position

      // Save PDF
      doc.save(`Solevara_Invoice_${invoiceNo}.pdf`);

    } catch (err) {
      console.error("Error generating invoice:", err);
      alert("Error generating invoice. Please try again.");
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
