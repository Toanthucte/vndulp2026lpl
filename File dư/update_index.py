import os

html_content = """<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Việt Nam Đồng Ứng Liệu Pháp</title>
    <meta name="description" content="Ứng dụng tra cứu bệnh và cách tự chữa gỡ bằng phương pháp Đồng Ứng." />

    <!-- PWA -->
    <link rel="manifest" href="./manifest.json" />
    <meta name="theme-color" content="#134e4a" />

    <!-- Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

    <link rel="stylesheet" href="./theme.css" />
    <link rel="stylesheet" href="./main.css" />
    <link rel="stylesheet" href="./responsive.css" />

    <script src="./js/data.js" defer></script>
    <script src="./js/app.js" defer></script>
  </head>
  <body>
    <!-- Top Header -->
    <header class="app-header">
      <div class="header-left">
        <button id="btn-back" class="icon-btn hidden" aria-label="Quay lại"><i class="fa-solid fa-arrow-left"></i></button>
      </div>
      <h1 id="app-title">Đồng Ứng Liệu Pháp</h1>
      <div class="header-controls">
        <button id="btn-info" class="icon-btn" aria-label="Thông tin"><i class="fa-solid fa-circle-info"></i></button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="app-main" id="app-main">
      
      <!-- Trang Chủ -->
      <section id="view-home" class="view active">
        <div class="search-section">
          <h2>Bạn cần tra cứu bệnh gì?</h2>
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" id="search-input" placeholder="VD: Nhức đầu, Mất ngủ, Đau lưng..." autocomplete="off">
            <button id="btn-voice-search" class="icon-btn voice-btn" aria-label="Tìm kiếm giọng nói">
              <i class="fa-solid fa-microphone"></i>
            </button>
          </div>
        </div>

        <div class="suggested-tags-section">
          <h3><i class="fa-solid fa-fire text-accent"></i> Tra cứu phổ biến</h3>
          <div class="tags-container" id="tags-container">
            <!-- JS Render -->
          </div>
        </div>

        <div class="search-results-section hidden" id="search-results-section">
          <h3>Kết quả tìm kiếm</h3>
          <div class="results-container" id="results-container">
            <!-- JS Render -->
          </div>
        </div>
      </section>

      <!-- Trang Chi tiết Bệnh -->
      <section id="view-detail" class="view hidden">
        <div class="detail-header">
          <h2 id="detail-title">Tên Bệnh</h2>
          <span class="category-badge" id="detail-category">Danh mục</span>
        </div>

        <div class="treatment-card">
          <h3 class="treatment-title"><i class="fa-solid fa-hand-holding-medical"></i> Chẩn & Trị</h3>
          
          <div class="media-container">
            <img id="detail-image" src="" alt="Ảnh minh họa" class="hidden" />
          </div>

          <div class="instruction-box">
            <div class="instruction-header">
               <h4>Hướng dẫn thao tác:</h4>
               <button id="btn-read-instruction" class="btn-tts" aria-label="Đọc hướng dẫn">
                 <i class="fa-solid fa-volume-high"></i> Nghe
               </button>
            </div>
            <div id="detail-instruction" class="instruction-text">
            </div>
          </div>
        </div>

        <div class="accordion-container" id="detail-accordions">
          
          <!-- Triệu chứng -->
          <div class="accordion-item">
            <button class="accordion-header" aria-expanded="false">
              <div class="acc-title"><i class="fa-solid fa-stethoscope"></i> Nguyên nhân & Triệu chứng</div>
              <i class="fa-solid fa-chevron-down acc-icon"></i>
            </button>
            <div class="accordion-content">
              <div class="acc-inner" id="detail-notes"></div>
            </div>
          </div>

          <!-- Video -->
          <div class="accordion-item">
            <button class="accordion-header" aria-expanded="false">
              <div class="acc-title"><i class="fa-brands fa-youtube"></i> Video Hướng Dẫn</div>
              <i class="fa-solid fa-chevron-down acc-icon"></i>
            </button>
            <div class="accordion-content">
              <div class="acc-inner">
                <p class="text-muted"><small>Video thực hành (sẽ được cập nhật):</small></p>
                <div class="video-grid" id="detail-videos">
                   <div class="video-placeholder"><span>Video 1</span></div>
                   <div class="video-placeholder"><span>Video 2</span></div>
                   <div class="video-placeholder"><span>Video 3</span></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Trang Đồ Hình -->
      <section id="view-dohinh" class="view hidden">
        <h2>Hệ thống Đồ Hình</h2>
        <p>Phần này đang được phát triển...</p>
      </section>

      <!-- Trang Giới thiệu -->
      <section id="view-about" class="view hidden">
        <div class="about-card">
          <h2>VN Đồng Ứng Liệu Pháp</h2>
          <p><strong>Sáng lập:</strong> Thầy Lý Phước Lộc</p>
          <hr>
          <p>Phương pháp điều trị bệnh không dùng thuốc. Chủ yếu bằng phương tiện cơ hữu: Ngón tay, Bàn tay, Cùi chỏ...</p>
        </div>
      </section>

    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <a href="#" class="nav-item active" data-target="view-home">
        <i class="fa-solid fa-house-medical"></i>
        <span>Tra cứu</span>
      </a>
      <a href="#" class="nav-item" data-target="view-dohinh">
        <i class="fa-solid fa-body-scan"></i>
        <span>Đồ Hình</span>
      </a>
      <a href="#" class="nav-item" data-target="view-about">
        <i class="fa-solid fa-book-medical"></i>
        <span>Nguyên lý</span>
      </a>
    </nav>
  </body>
</html>"""

path = r"d:\@Online-2024\App-VNDULP2026LPL\vndulp2026lpl\index.html"
with open(path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Updated index.html")
