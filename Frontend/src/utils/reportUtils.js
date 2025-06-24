import jsPDF from 'jspdf';

export const saveSession = (session) => {
  const sessions = JSON.parse(localStorage.getItem('qa_sessions')) || [];
  sessions.push(session);
  localStorage.setItem('qa_sessions', JSON.stringify(sessions));
};

export const downloadPDF = (report) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Interview Feedback Report", 20, 20);
  let y = 30;
  report.forEach((item, i) => {
    doc.text(`Q${i + 1}: ${item.question}`, 20, y);
    y += 10;
    doc.text(`Answer: ${item.answer}`, 20, y);
    y += 10;
  });
  doc.save("interview_feedback.pdf");
};
