function capture() {
   var captureImg = document.getElementById("capture_img");
   // 페이지 스크롤을 상단으로 이동
      window.scrollTo(0, 0);
   // html2canvas로 캡처
   html2canvas(document.getElementById('capture_area'), {
      scale: 5, // 캔버스 해상도 배율 (기본 1.0 -> 2.0으로 화질 개선)
      useCORS: true // CORS 에러 방지 (필요 시)
   }).then(function(canvas) {
      // 캡처된 이미지를 img 태그에 삽입
      var captureImgData = canvas.toDataURL('image/png');
      captureImg.src = captureImgData;
   });

   // 캡처 후 PDF 생성
   setTimeout(function() {
      $(".main-container").hide();
      $("#capture_img").show();

      const pdfOptions = {
         margin: 1,
         filename: 'document.pdf',
      };

      html2pdf().set(pdfOptions).from(document.getElementById('capture_img')).save();
   }, 1000);

   // 화면 복원
   setTimeout(function() {
      $(".main-container").show();
      $("#capture_img").hide();
   }, 2000);
}