$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
$(document).ready(function () {
  if (window.location.hash) {
    window.location.hash = "";
  }

  $(window).scroll(function() {
    if ($(this).scrollTop() > 10) { 
      $('.navbar').addClass('shadow'); 
    } else {
      $('.navbar').removeClass('shadow'); 
    }
  });

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

  // Untuk event klik kenali
  $(".kenali").click(function (e) {
    e.preventDefault();
    $(".fitur a").removeClass("active");
    $(".fitur a[href='#about']").addClass("active");
    $("html, body").animate(
      {
        scrollTop: $("#about").offset().top - 55,
      },
      1000
    );
  });
});
$(window).on("load hashchange", function () {
  var hash = window.location.hash;
  if (hash == "#home" || hash == "") {
    $('.fitur a[href="' + hash + '"]').addClass("active");
  } else {
    $(".fitur a").removeClass("active");
    $('.fitur a[href="' + hash + '"]').addClass("active");
  }
});

// Menambahkan kelas active ke elemen fitur saat menggulir
$(window).scroll(function () {
  var scrollPos = $(document).scrollTop();
  var offset = 70; // Ubah nilai offset sesuai kebutuhan
  $(".fitur a").each(function () {
    var currLink = $(this);
    var refElement = $(currLink.attr("href"));
    if (
      refElement.position().top - offset < scrollPos &&
      refElement.position().top + refElement.height() > scrollPos
    ) {
      $(".fitur a").removeClass("active");
      currLink.addClass("active");
    }
  });
});
