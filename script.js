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

  // Untuk event contact wa hide ketika sampai ke footer
  const footer = $("#footer");
  const contactContainer = $(".contact-container");

  function isAtFooter() {
    const scrollPosition = $(window).scrollTop();
    const footerPosition = footer.offset().top;
    const windowHeight = $(window).height();

    return scrollPosition >= footerPosition - windowHeight;
  }

  function toggleContactContainer() {
    if (isAtFooter()) {
      contactContainer.hide();
    } else {
      contactContainer.show();
    }
  }

  $(window).on("load scroll", toggleContactContainer);

  $(window).on("beforeunload", function () {
    $(window).scrollTop(0);
  });

  // Seleksi elemen-elemen DOM yang diperlukan
  const wrapper = document.querySelector(".wrapper"); // Wrapper carousel
  const carousel = document.querySelector(".carousel"); // Kontainer carousel
  const firstCardWidth = carousel.querySelector(".card").offsetWidth; // Lebar kartu pertama dalam carousel
  const arrowBtns = document.querySelectorAll(".wrapper i"); // Tombol panah kiri dan kanan
  const carouselChildrens = [...carousel.children]; // Anak-anak dari carousel dalam bentuk array

  // Variabel untuk menandai status drag dan autoplay
  let isDragging = false,
    isAutoPlay = true,
    startX,
    startScrollLeft,
    timeoutId;

  // Mendapatkan jumlah kartu yang dapat ditampilkan dalam carousel sekaligus
  let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

  // Menyisipkan salinan kartu terakhir ke awal carousel untuk infinite scrolling
  carouselChildrens
    .slice(-cardPerView)
    .reverse()
    .forEach((card) => {
      carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });

  // Menyisipkan salinan kartu pertama ke akhir carousel untuk infinite scrolling
  carouselChildrens.slice(0, cardPerView).forEach((card) => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
  });

  // Menggeser carousel ke posisi yang tepat untuk menyembunyikan beberapa kartu duplikat pertama pada Firefox
  carousel.classList.add("no-transition");
  carousel.scrollLeft = carousel.offsetWidth;
  carousel.classList.remove("no-transition");

  // Menambahkan event listener untuk tombol panah untuk menggeser carousel ke kiri dan kanan
  arrowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      carousel.scrollLeft +=
        btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
  });

  // Fungsi untuk memulai drag
  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Merekam posisi kursor awal dan posisi scroll awal carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };

  // Fungsi untuk menangani peristiwa dragging
  const dragging = (e) => {
    if (!isDragging) return; // Jika isDragging adalah false, keluar dari fungsi
    // Memperbarui posisi scroll carousel berdasarkan pergerakan kursor
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  };

  // Fungsi untuk menghentikan drag
  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };

  // Fungsi untuk infinite scrolling
  const infiniteScroll = () => {
    // Jika carousel berada di awal, geser ke akhir
    if (carousel.scrollLeft === 0) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }
    // Jika carousel berada di akhir, geser ke awal
    else if (
      Math.ceil(carousel.scrollLeft) ===
      carousel.scrollWidth - carousel.offsetWidth
    ) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }

    // Hapus timeout yang ada & mulai autoplay jika mouse tidak berada di atas carousel
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
  };

  // Fungsi untuk autoplay
  const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return; // Keluar jika lebar window lebih kecil dari 800 atau isAutoPlay adalah false
    // Autoplay carousel setiap 2500 ms
    timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
  };
  autoPlay();

  // Menambahkan event listener untuk mousedown, mousemove, mouseup, scroll, mouseenter, dan mouseleave
  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  carousel.addEventListener("scroll", infiniteScroll);
  wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
  wrapper.addEventListener("mouseleave", autoPlay);

  $(".cek-harga-btn").click(function() {
    var card = $(this).closest(".card");
    var namaProduk = card.find("h2").text();
    var deskripsiProduk = card.find(".deskripsi").text();
    var hargaProduk = card.find(".harga").text();
  
    // Tampilkan SweetAlert dengan detail produk
    Swal.fire({
      title: 'Detail Produk',
      html: `
        <div>
          <b>Nama:</b> ${namaProduk}<br>
          <b>Deskripsi:</b> ${deskripsiProduk}<br>
          <b>Harga:</b> ${hargaProduk}
        </div>
      `,
      icon: false,
      confirmButtonText: 'Tutup'
    });
  });
  
});
function toggleMenu() {
  var menu = $("#navbar-menu");
  var toggleButton = $(".navbar-toggle");
  menu.toggleClass("active");
  toggleButton.toggleClass("active");
}
