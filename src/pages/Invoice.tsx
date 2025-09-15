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

      // GST calculation
      const gstRate = invoiceData.gstRate ?? 0.18;
      const subTotal = invoiceData.totalPrice;
      const tax = subTotal * gstRate;
      const grandTotal = subTotal + tax;
      const invoiceNo = invoiceData.invoiceNo || "INV-0001";
      const currentDate = new Date().toLocaleDateString();

      // Create image element for invoice template
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "/assets/invoice-template.png";

      img.onload = () => {
        try {
          // Draw background image
          doc.addImage(img, "PNG", 0, 0, 595, 842);

          // Set font for better text rendering
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);

          // Company Header (top section)
          doc.setFontSize(24);
          doc.setFont("helvetica", "bold");
          doc.text("SOLEVARA PERFUMES", 50, 80);
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text("Organic Fragrances | Premium Quality", 50, 100);
          doc.text("Email: info@solevara.com | Phone: +91 00000100001", 50, 115);

          // Invoice Details (top right)
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text("INVOICE", 450, 80);
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(`Invoice No: ${invoiceNo}`, 450, 100);
          doc.text(`Date: ${currentDate}`, 450, 115);

          // Customer Details (left side)
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text("BILL TO:", 50, 160);
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(invoiceData.customerName || "Customer Name", 50, 180);
          doc.text(invoiceData.email || "customer@email.com", 50, 195);
          doc.text(invoiceData.phone || "Phone Number", 50, 210);
          if (invoiceData.address) {
            doc.text(invoiceData.address, 50, 225);
          }

          // Table Header
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("ITEM", 50, 270);
          doc.text("QTY", 300, 270);
          doc.text("PRICE", 380, 270);
          doc.text("TOTAL", 480, 270);

          // Draw line under header
          doc.line(50, 275, 545, 275);

          // Products
          doc.setFont("helvetica", "normal");
          let y = 295;
          invoiceData.cart.forEach((item: any) => {
            const itemName = item.name.length > 30 ? item.name.substring(0, 30) + "..." : item.name;
            doc.text(itemName, 50, y);
            doc.text(String(item.quantity), 300, y);
            doc.text(`₹${item.price.toLocaleString()}`, 380, y);
            doc.text(`₹${(item.price * item.quantity).toLocaleString()}`, 480, y);
            y += 20;
          });

          // Draw line before totals
          doc.line(300, y + 10, 545, y + 10);

          // Totals section
          const totalsY = y + 30;
          doc.text("Subtotal:", 400, totalsY);
          doc.text(`₹${subTotal.toLocaleString()}`, 480, totalsY);
          
          doc.text("GST (18%):", 400, totalsY + 20);
          doc.text(`₹${tax.toLocaleString()}`, 480, totalsY + 20);
          
          // Draw line before grand total
          doc.line(400, totalsY + 30, 545, totalsY + 30);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("GRAND TOTAL:", 400, totalsY + 50);
          doc.text(`₹${grandTotal.toLocaleString()}`, 480, totalsY + 50);

          // Footer
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.text("Thank you for choosing Solévara Perfumes!", 50, 750);
          doc.text("For any queries, contact us at info@solevara.com", 50, 765);

          // Save PDF
          doc.save(`Solevara_Invoice_${invoiceNo}.pdf`);
        } catch (error) {
          console.error("Error generating PDF:", error);
          // Fallback: generate PDF without template
          generateFallbackPDF();
        }
      };

      img.onerror = (err) => {
        console.error("Error loading invoice template image:", err);
        // Fallback: generate PDF without template
        generateFallbackPDF();
      };

      // Fallback PDF generation without template
      const generateFallbackPDF = () => {
        const doc = new jsPDF("p", "pt", "a4");
        
        // Header
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("SOLEVARA PERFUMES", 50, 50);
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("INVOICE", 50, 80);
        doc.text(`Invoice No: ${invoiceNo}`, 50, 100);
        doc.text(`Date: ${currentDate}`, 50, 120);
        
        // Customer details
        doc.text(`Customer: ${invoiceData.customerName}`, 50, 150);
        doc.text(`Email: ${invoiceData.email}`, 50, 170);
        
        // Products
        let y = 200;
        doc.text("Items:", 50, y);
        y += 20;
        
        invoiceData.cart.forEach((item: any) => {
          doc.text(`${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}`, 50, y);
          y += 20;
        });
        
        // Totals
        y += 20;
        doc.text(`Subtotal: ₹${subTotal.toLocaleString()}`, 50, y);
        doc.text(`GST (18%): ₹${tax.toLocaleString()}`, 50, y + 20);
        doc.setFont("helvetica", "bold");
        doc.text(`Total: ₹${grandTotal.toLocaleString()}`, 50, y + 40);
        
        doc.save(`Solevara_Invoice_${invoiceNo}.pdf`);
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
