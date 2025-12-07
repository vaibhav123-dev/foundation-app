import { jsPDF } from 'jspdf';

interface CertificateData {
  memberName: string;
  joinedDate: string;
  founderName: string;
  founderSignature?: string;
}

export const generateCertificate = async (data: CertificateData): Promise<Blob> => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background color
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Border
  doc.setLineWidth(2);
  doc.setDrawColor(0, 100, 0); // Dark green
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner border
  doc.setLineWidth(0.5);
  doc.setDrawColor(34, 197, 94); // Light green
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Add logo
  try {
    // Load logo from public folder
    const logoResponse = await fetch('/logo.jpg');
    const logoBlob = await logoResponse.blob();
    const logoDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logoBlob);
    });
    
    doc.addImage(logoDataUrl, 'JPEG', pageWidth / 2 - 25, 25, 50, 50);
  } catch (error) {
    console.error('Error loading logo:', error);
  }

  // Title
  doc.setFontSize(40);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('CERTIFICATE OF MEMBER', pageWidth / 2, 90, { align: 'center' });

  // Subtitle
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('VEER BHAGAT SINGH FOUNDATION', pageWidth / 2, 100, { align: 'center' });

  // Divider
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(50, 105, pageWidth - 50, 105);

  // Main content
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('This is to certify that', pageWidth / 2, 120, { align: 'center' });

  // Member name
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 100, 0);
  doc.text(data.memberName, pageWidth / 2, 135, { align: 'center' });

  // Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const descriptionLines = [
    'has been accepted as a valued member of Veer Bhagat Singh Foundation.',
    'As a member, you are now part of our mission to serve the community',
    'and uphold the values and ideals of Shaheed Bhagat Singh.',
    'Together, we work towards social welfare, education, and empowerment.',
  ];
  
  let yPosition = 145;
  descriptionLines.forEach((line) => {
    doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
  });

  // Date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const formattedDate = new Date(data.joinedDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Date of Joining: ${formattedDate}`, pageWidth / 2, 175, { align: 'center' });

  // Founder signature section
  // Add signature (cursive handwriting style)
  doc.setFontSize(16);
  doc.setFont('times', 'italic');
  doc.setTextColor(0, 0, 139); // Dark blue ink color
  
  // Draw signature
  const signatureText = 'Pranay Rode';
  doc.text(signatureText, pageWidth - 60, pageHeight - 42, { align: 'center' });
  
  // Add decorative flourish line under signature
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 139);
  // Underline for signature
  const startX = pageWidth - 78;
  const endX = pageWidth - 42;
  const y = pageHeight - 39;
  doc.line(startX, y, endX, y);
  // Add a small flourish/swoosh at the end
  doc.line(endX, y, endX + 2, y - 1);
  
  // Founder name and title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Founder/Chairman', pageWidth - 60, pageHeight - 32, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Pranay Rode', pageWidth - 60, pageHeight - 27, { align: 'center' });
  doc.setFontSize(9);
  doc.text('Veer Bhagat Singh Foundation', pageWidth - 60, pageHeight - 22, { align: 'center' });

  // Return as blob
  return doc.output('blob');
};

export const downloadCertificate = (blob: Blob, memberName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${memberName.replace(/\s+/g, '_')}_Certificate.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
