$(document).ready(function () {
  // Untuk animasi fitur & tambah kelas
  $(".fitur a").click(function (e) {
    $(".fitur a").removeClass("active");
    $(this).addClass("active");
    var target = $(this).attr("href");
    if ($(target).length) {
      if (target.charAt(0) === "#home") {
        window.location.href = target;
      } else {
        $("html, body").animate(
          {
            scrollTop: $(target).offset().top - 55,
          },
          1000
        );
      }
    }
  });

  // Untuk event klik logo
  $("#logo").click(function (e) {
    e.preventDefault();
  });
});
