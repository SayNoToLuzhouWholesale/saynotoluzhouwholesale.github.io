// 照片橫向滾動與輪播 + modal 預覽
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    fetch('files/images.json')
        .then(response => response.json())
        .then(images => {
            carouselContainer.innerHTML = '';
            images.forEach(image => {
                const img = document.createElement('img');
                img.src = `images/${image}`;
                img.alt = `新北三重果菜市場遷移蘆洲南北側照片`;
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => openImageModal(`images/${image}`));
                carouselContainer.appendChild(img);
            });
            // 僅大於1張時自動輪播
            if (images.length > 1) {
                let index = 0;
                setInterval(() => {
                    carouselContainer.scrollTo({
                        left: index * carouselContainer.clientWidth,
                        behavior: 'smooth'
                    });
                    index = (index + 1) % images.length;
                }, 3500);
            }
        })
        .catch(error => {
            console.error('載入圖片失敗:', error);
            carouselContainer.innerHTML = '<p>載入圖片時發生錯誤，請稍後再試。</p>';
        });
}

// Modal 功能
function openImageModal(src) {
    let modal = document.getElementById('image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="關閉">×</button>
                <img src="" alt="大圖預覽" />
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.modal-close').onclick = closeImageModal;
        modal.querySelector('.modal-backdrop').onclick = closeImageModal;
    }
    modal.querySelector('img').src = src;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}
function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 200);
    }
}

// 影片橫向滾動
const videoGallery = document.querySelector('.video-gallery');
if (videoGallery) {
    fetch('files/videos.json')
        .then(response => response.json())
        .then(videos => {
            videoGallery.innerHTML = '';
            videos.forEach(video => {
                const videoContainer = document.createElement('div');
                videoContainer.className = 'video-container';
                const videoElement = document.createElement('video');
                videoElement.src = `videos/${video}`;
                videoElement.controls = true;
                videoElement.preload = 'metadata';
                videoElement.title = `新北三重果菜市場遷移蘆洲南北側-${video}`;
                const title = document.createElement('h4');
                title.textContent = video.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
                videoContainer.appendChild(videoElement);
                videoContainer.appendChild(title);
                videoGallery.appendChild(videoContainer);
            });
        })
        .catch(error => {
            console.error('載入影片失敗:', error);
            videoGallery.innerHTML = '<p>載入影片時發生錯誤，請稍後再試。</p>';
        });
}

// PDF 橫向滾動
const pdfList = document.querySelector('.pdf-list');
if (pdfList) {
    fetch('files/pdfs.json')
        .then(response => response.json())
        .then(pdfs => {
            pdfList.innerHTML = '';
            pdfs.forEach(pdf => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `pdfs/${pdf}`;
                a.textContent = pdf.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
                a.target = '_blank';
                a.title = `下載PDF：${pdf}`;
                const description = document.createElement('p');
                description.className = 'pdf-description';
                if (pdf.includes('三重果菜市場')) {
                    description.textContent = '了解新北三重果菜市場搬遷蘆洲南北側的爭議及影響評估。';
                } else {
                    description.textContent = '銀河灣計畫相關資料文件。';
                }
                const previewContainer = document.createElement('div');
                previewContainer.className = 'pdf-preview';
                const iframe = document.createElement('iframe');
                iframe.src = `pdfs/${pdf}`;
                iframe.width = '100%';
                iframe.height = '300px';
                previewContainer.appendChild(iframe);
                li.appendChild(a);
                li.appendChild(description);
                li.appendChild(previewContainer);
                pdfList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('載入PDF失敗:', error);
            pdfList.innerHTML = '<p>載入PDF資料時發生錯誤，請稍後再試。</p>';
        });
}

// 首頁橫幅大圖點擊可開啟 modal
const bannerImgs = document.querySelectorAll('.banner-img');
if (bannerImgs.length > 0) {
    bannerImgs.forEach(bannerImg => {
        bannerImg.addEventListener('click', function() {
            openImageModal(this.src);
        });
    });
}

// 最新消息 Modal
function openNewsModal(html) {
    let modal = document.getElementById('news-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'news-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="關閉">×</button>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.modal-close').onclick = closeNewsModal;
        modal.querySelector('.modal-backdrop').onclick = closeNewsModal;
    }
    modal.querySelector('.modal-body').innerHTML = html;
    // 圖片點擊可放大（用 image-modal）
    const imgs = modal.querySelectorAll('img');
    imgs.forEach(img => {
        img.onclick = function(e) {
            e.stopPropagation();
            openImageModal(this.src);
        };
    });
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}
function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 200);
    }
}

// 最新消息區塊渲染
function renderNewsSection() {
    const newsSection = document.getElementById('news-section');
    if (!newsSection) return;
    fetch('files/news.json')
        .then(res => res.json())
        .then(newsArr => {
            if (!Array.isArray(newsArr) || newsArr.length === 0) {
                newsSection.innerHTML = '';
                return;
            }
            let html = '<h2 style="color:#e63946;">最新消息</h2><ul class="news-list">';
            newsArr.forEach((item, idx) => {
                html += `<li data-idx="${idx}">${item.title}</li>`;
            });
            html += '</ul>';
            newsSection.innerHTML = html;
            // 點擊顯示詳細內容（用 Modal）
            const listItems = newsSection.querySelectorAll('.news-list li');
            listItems.forEach(li => {
                li.onclick = function() {
                    const idx = this.getAttribute('data-idx');
                    const item = newsArr[idx];
                    let detail = `<strong>${item.title}</strong><br><br>${item.content.replace(/\n/g,'<br>')}`;
                    if(item.image) detail += `<br><img src="${item.image}" alt="最新消息圖片">`;
                    openNewsModal(detail);
                };
            });
        });
}
renderNewsSection();

// 圖片 gallery（媒體資源頁）點擊可用 image-modal 放大
function enableGalleryImageModal() {
    // 支援 .carousel-container.fixed-size 及 .photo-gallery
    const galleryImgs = document.querySelectorAll('.carousel-container.fixed-size img, .photo-gallery img');
    galleryImgs.forEach(img => {
        img.style.cursor = 'pointer';
        img.onclick = function(e) {
            e.stopPropagation();
            openImageModal(this.src);
        };
    });
}
window.addEventListener('DOMContentLoaded', enableGalleryImageModal);
