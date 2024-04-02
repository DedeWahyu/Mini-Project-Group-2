$(document).ready(function () {
  // Reset location hash
  if (window.location.hash) {
    window.location.hash = "";
  }

  // Menambahkan kelas active ke elemen fitur saat menggulir
  $(window).scroll(function () {
    var scrollPos = $(document).scrollTop();
    var offset = 76; // Ubah nilai offset sesuai kebutuhan
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

  // Untuk animasi fitur & tambah kelas
  $(".fitur a,.halaman-footer a").click(function (e) {
    $(".fitur a").removeClass("active");
    $(this).addClass("active");
    var target = $(this).attr("href");
    if ($(target).length) {
      if (target.charAt(0) === "#home") {
        window.location.href = target;
      } else if (target === "#product") {
        $("html, body").animate(
          {
            scrollTop: $(target).offset().top - 55,
          },
          1000
        );
      } else {
        $("html, body").animate(
          {
            scrollTop: $(target).offset().top - 70,
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

  // ini untuk ajax mengambil data dari paket.json lalu ditampilkan
  $.ajax({
    url: "https://dedewahyu.github.io/Mini-Project-Group-2/paket.json",
    type: "GET",
    dataType: "json",
    success: function (data) {
      // Generate Paket
      $.each(data.packages, (packageName, packageData) => {
        var paketName = $(".paket-card." + packageName);
        var paketImg = $(".paket-card." + packageName + " .image");
        var overlayPaket = $(".paket-card." + packageName + " .overlay-paket");

        paketName.prepend("<h2>" + packageData.name + "</h2>");
        paketImg.prepend(
          "<img src=" + packageData.image + " alt=" + packageName + " />"
        );
        overlayPaket.empty();
        overlayPaket.append(
          "<h2>Harga Paket " +
            packageName.charAt(0).toUpperCase() +
            packageName.slice(1) +
            "</h2>"
        );
        overlayPaket.append("<p>Normal : " + packageData.normal + "</p>");
        overlayPaket.append(
          "<p>Minus/Plus : " + packageData.minusPlus + "</p>"
        );
        overlayPaket.append("<p>Silinder : " + packageData.silinder + "</p>");
        overlayPaket.append(
          "<p>Custom Frame : " + packageData.customFrame + "</p>"
        );
        paketName.append("<p>Start From " + packageData.price + "</p>");
      });
      // generate frame
      var frameListHtml = "";
      $.each(data.frames, function (index, frame) {
        frameListHtml +=
          '<li class="card">' +
          '<div class="img"><img src="' +
          frame.image +
          '" alt="img" draggable="false" /></div>' +
          "<h2>" +
          frame.name +
          "</h2>" +
          '<p class="deskripsi">' +
          frame.description +
          "</p>" +
          '<button class="cek-harga-btn">Cek Detail</button>' +
          "</li>";
      });
      $(".carousel").html(frameListHtml);
      swipe();
    },
    error: (xhr, status, error) => {
      console.error(error);
    },
  });
  // Untuk event contact wa hide ketika sampai ke footer
  $(window).on("load scroll", toggleContactContainer);

  // Untuk mereset lokasi ketika meninggalkan web
  $(window).on("beforeunload", function () {
    $(window).scrollTop(0);
  });
});

// Function untuk mendeteksi apakah sudah sampai footer
const isAtFooter = () => {
  const footer = $("#footer");
  const scrollPosition = $(window).scrollTop();
  const footerPosition = footer.offset().top;
  const windowHeight = $(window).height();

  return scrollPosition >= footerPosition - windowHeight;
};

// Function hide/show contact us
const toggleContactContainer = () => {
  const contactContainer = $(".contact-container");
  if (isAtFooter()) {
    contactContainer.hide();
  } else {
    contactContainer.show();
  }
};

// Function on mini display
const toggleMenu = () => {
  var menu = $("#navbar-menu");
  var toggleButton = $(".navbar-toggle");
  menu.toggleClass("active");
  toggleButton.toggleClass("active");
};

// Function swipe
const swipe = () => {
  // Seleksi elemen-elemen jQuery yang diperlukan
  const wrapper = $(".wrapper"); // Wrapper carousel
  const carousel = $(".carousel"); // Kontainer carousel
  const firstCardWidth = $(".carousel .card").outerWidth(); // Lebar kartu pertama dalam carousel
  const arrowBtns = $(".wrapper i"); // Tombol panah kiri dan kanan
  const carouselChildrens = carousel.children(); // Anak-anak dari carousel

  // Variabel untuk menandai status drag dan autoplay
  let isDragging = false,
    isAutoPlay = true,
    startX,
    startScrollLeft,
    timeoutId;

  // Mendapatkan jumlah kartu yang dapat ditampilkan dalam carousel sekaligus
  let cardPerView = Math.round(carousel.outerWidth() / firstCardWidth);

  // Menyisipkan salinan kartu terakhir ke awal carousel untuk infinite scrolling
  carouselChildrens.slice(-cardPerView).clone().prependTo(carousel);

  // Menyisipkan salinan kartu pertama ke akhir carousel untuk infinite scrolling
  carouselChildrens.slice(0, cardPerView).clone().appendTo(carousel);

  // Menggeser carousel ke posisi yang tepat untuk menyembunyikan beberapa kartu duplikat pertama pada Firefox
  carousel.addClass("no-transition");
  carousel.scrollLeft(carousel.outerWidth());
  carousel.removeClass("no-transition");

  // Menambahkan event listener untuk tombol panah untuk menggeser carousel ke kiri dan kanan
  arrowBtns.on("click", function () {
    carousel.scrollLeft(
      carousel.scrollLeft() +
        ($(this).attr("id") === "left" ? -firstCardWidth : firstCardWidth)
    );
  });

  // Fungsi untuk memulai drag
  const dragStart = (e) => {
    isDragging = true;
    carousel.addClass("dragging");
    // Merekam posisi kursor awal dan posisi scroll awal carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft();
  };

  // Fungsi untuk menangani peristiwa dragging
  const dragging = (e) => {
    if (!isDragging) return; // Jika isDragging adalah false, keluar dari fungsi
    // Memperbarui posisi scroll carousel berdasarkan pergerakan kursor
    carousel.scrollLeft(startScrollLeft - (e.pageX - startX));
  };

  // Fungsi untuk menghentikan drag
  const dragStop = () => {
    isDragging = false;
    carousel.removeClass("dragging");
  };

  // Fungsi untuk infinite scrolling
  const infiniteScroll = () => {
    // Jika carousel berada di awal, geser ke akhir
    if (carousel.scrollLeft() === 0) {
      carousel
        .addClass("no-transition")
        .scrollLeft(carousel[0].scrollWidth - 2 * carousel.outerWidth())
        .removeClass("no-transition");
    }
    // Jika carousel berada di akhir, geser ke awal
    else if (
      Math.ceil(carousel.scrollLeft()) ===
      carousel[0].scrollWidth - carousel.outerWidth()
    ) {
      carousel
        .addClass("no-transition")
        .scrollLeft(carousel.outerWidth())
        .removeClass("no-transition");
    }

    // Hapus timeout yang ada & mulai autoplay jika mouse tidak berada di atas carousel
    clearTimeout(timeoutId);
    if (!wrapper.is(":hover")) autoPlay();
  };

  // Fungsi untuk autoplay
  const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return; // Keluar jika lebar window lebih kecil dari 800 atau isAutoPlay adalah false
    // Autoplay carousel setiap 2500 ms
    timeoutId = setTimeout(
      () => carousel.scrollLeft(carousel.scrollLeft() + firstCardWidth),
      2500
    );
  };
  autoPlay();

  // Menambahkan event listener untuk mousedown, mousemove, mouseup, scroll, mouseenter, dan mouseleave
  carousel.on("mousedown", dragStart);
  carousel.on("mousemove", dragging);
  $(document).on("mouseup", dragStop);
  carousel.on("scroll", infiniteScroll);
  wrapper.on("mouseenter", () => clearTimeout(timeoutId));
  wrapper.on("mouseleave", autoPlay);

  // Menggunakan event delegation untuk menangani klik pada tombol "cek-harga-btn" yang dinamis
  wrapper.on("click", ".cek-harga-btn", function () {
    var card = $(this).closest(".card");
    var namaProduk = card.find("h2").text();
    var deskripsiProduk = card.find(".deskripsi").text();

    // Tampilkan SweetAlert dengan detail produk
    Swal.fire({
      title: "Detail Produk",
      html: `
       <div>
         <b>Nama: </b>${namaProduk}<br>
         <b>Bahan: </b>${deskripsiProduk}<br>
       </div>
     `,
      icon: false,
      confirmButtonText: "Tutup",
    });
  });
};
