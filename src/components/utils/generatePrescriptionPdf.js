import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import moment from 'moment';

export const generatePrescriptionPdf = async (elementId, patientName) => {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error("Prescription element not found!");
        return;
    }

    try {
        // Temporarily adjust styles for better capturing if necessary (e.g. background color)
        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = '#ffffff';

        const scale = 2;
        const width = element.offsetWidth;
        const height = element.offsetHeight;

        // Capture the element using dom-to-image with explicit sizes and scale
        const dataUrl = await domtoimage.toPng(element, { 
            quality: 1.0,
            bgcolor: '#ffffff',
            width: width * scale,
            height: height * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: `${width}px`,
                height: `${height}px`,
                margin: '0'
            }
        });

        // Restore original background
        element.style.backgroundColor = originalBg;

        // Initialize jsPDF (Portrait, millimeters, A4 size)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        // Calculate height based on A4 ratio or element ratio
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Add the image to the PDF
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Generate filename
        const safeName = patientName ? patientName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'patient';
        const dateStr = moment().format('YYYY-MM-DD');

        // Download the PDF
        pdf.save(`Prescription_${safeName}_${dateStr}.pdf`);

    } catch (error) {
        console.error("Error generating PDF: ", error);
        alert("Failed to generate PDF. " + (error.message || error));
    }
};