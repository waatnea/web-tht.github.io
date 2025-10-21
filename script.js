function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    const errorElement = document.getElementById('passwordError');
    
    if (password === 'elinesağlık') {
        document.getElementById('passwordOverlay').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            const loading = document.getElementById('loading');
            loading.classList.add('fade-out');
            setTimeout(() => loading.remove(), 500);
        }, 1500);
    } else {
        errorElement.textContent = 'Hatalı şifre! Lütfen tekrar deneyin.';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        document.body.style.overflow = 'hidden';
    } else {
        const loading = document.getElementById('loading');
        if (loading) {
            setTimeout(() => {
                loading.classList.add('fade-out');
                setTimeout(() => loading.remove(), 500);
            }, 1500);
        }
    }
    
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.rule-card, .team-card').forEach(el => {
        observer.observe(el);
    });

    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            this.style.background = 'linear-gradient(145deg, rgba(37,99,235,0.15), rgba(30,41,59,0.4))';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            this.style.background = 'var(--card-bg)';
            this.classList.add('shine');
            setTimeout(() => this.classList.remove('shine'), 600);
        });
    });

    teamCards.forEach(card => {
        card.addEventListener('click', function() {
            teamCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const team = this.getAttribute('data-team');
            loadRoadmap(team);
            setTimeout(() => {
                document.querySelector('.roadmap-content')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        });
    });

    document.addEventListener('click', function(e) {
        if (e.target.closest('.category-header')) {
            const header = e.target.closest('.category-header');
            const content = header.nextElementSibling;
            const toggle = header.querySelector('.category-toggle');
            document.querySelectorAll('.category-content.expanded').forEach(item => {
                if (item !== content) {
                    item.classList.remove('expanded');
                    const otherToggle = item.previousElementSibling.querySelector('.category-toggle');
                    if (otherToggle) {
                        otherToggle.style.transform = 'rotate(0deg)';
                    }
                }
            });
            content.classList.toggle('expanded');
            if (toggle) {
                toggle.style.transform = content.classList.contains('expanded') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }
        
        if (e.target.closest('.resource-link')) {
            const link = e.target.closest('.resource-link');
            const url = link.getAttribute('href');
            if (url && url !== '#' && !url.includes('javascript:')) {
                e.preventDefault();
                window.open(url, '_blank');
            }
        }
    });
});

function loadRoadmap(team) {
    const container = document.querySelector('.roadmap-content');
    if (!container) return;

    container.innerHTML = `
        <div class="roadmap-loading">
            <div class="loading-spinner"></div>
            <p>Roadmap yükleniyor...</p>
        </div>
    `;

    setTimeout(() => {
        const data = getRoadmapData(team);
        renderRoadmap(data, container);
        
        setTimeout(() => {
            const roadmapContainer = container.querySelector('.roadmap-container');
            roadmapContainer.style.opacity = '0';
            roadmapContainer.style.transform = 'translateY(30px)';
            setTimeout(() => {
                roadmapContainer.style.transition = 'all 0.6s ease';
                roadmapContainer.style.opacity = '1';
                roadmapContainer.style.transform = 'translateY(0)';
            }, 100);
        }, 50);
    }, 800);
}

function getRoadmapData(team) {
    const roadmaps = {
        red: {
            title: "Red Team Roadmap",
            desc: "Anka Red Team ekibi.",
            icon: "fas fa-user-secret",
            categories: [
                {
                    title: "Bilgisayar Ağları & Temeller",
                    icon: "fas fa-network-wired",
                    resources: [
                        { title: "OSI Katmanları", url: "https://www.turkhackteam.org/konular/osi-ve-osi-katmanlari.2049423/", description: "Kapsamlı ağ eğitim serisi" },
                        { title: "İnternet 101 - Hacker'ın Gözünden", url: "https://www.turkhackteam.org/konular/meridyenler-ile-dunya-internetin-konusma-dili-ve-gizli-mesajlari-http-https-istekleri-ve-durum-kodlari-hackerin-gozuyle.2073223/", description: "İnternet protokolleri ve çalışma mantığı" },
                        { title: "HTTP Durum Kodları", url: "https://www.turkhackteam.org/konular/http-hata-kodlari-ve-anlamlari.1910224/", description: "HTTP hata kodları ve anlamları" }
                    ]
                },
                {
                    title: "Linux & Sistem Yönetimi",
                    icon: "fas fa-terminal",
                    resources: [
                        { title: "Linux Shell Script Yazma Eğitimi", url: "https://www.turkhackteam.org/konular/linux-shell-script-yazma-egitimi-temel-bilgiler-ve-baslangic-1.2020406/", description: "Temel shell script bilgileri" },
                        { title: "Linux Shell Script Gelişmiş", url: "https://www.turkhackteam.org/konular/linux-shell-script-yazma-egitimi-kodlamaya-devam-ve-uygulamalar-2.2020719/", description: "İleri seviye shell script" },
                        { title: "Linux 101 Türkçe Eğitim Kitabı", url: "https://www.turkhackteam.org/konular/turkce-linux-101-kitabi.2065870/", description: "Temel Linux eğitim kitabı" },
                    ]
                },
                {
                    title: "Web Uygulama Güvenliği",
                    icon: "fas fa-bug",
                    resources: [
                        { title: "Web Zaafiyetleri TOP10", url: "https://www.youtube.com/watch?v=L2IeNUgI5pc&list=PLbgYZ8br1olv-r1oOMIfKmymEw-foqiz-", description: "OWASP Top 10 zaafiyetleri" },
                        { title: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", description: "Interaktif web güvenliği laboratuvarları" },
                        { title: "HackTricks Wiki", url: "https://book.hacktricks.wiki/en/index.html", description: "Kapsamlı pentest bilgi bankası" }
                    ]
                },
                {
                    title: "XSS - Cross Site Scripting",
                    icon: "fas fa-code",
                    resources: [
                        { title: "XSS A'dan Z'ye Rehber", url: "https://www.turkhackteam.org/konular/sifirdan-zirveye-cross-site-scripting.2007540/", description: "Kapsamlı XSS rehberi" },
                        { title: "XSS Pratik Uygulamalar", url: "https://www.turkhackteam.org/konular/site-hackleme-rehberi-2.1988103/", description: "Pratik XSS senaryoları" },
                        { title: "Web Hacking 101 - XSS", url: "https://www.turkhackteam.org/konular/web-hacking-101-serisi-xss.2038468/", description: "XSS zaafiyet serisi" }
                    ]
                },
                {
                    title: "SQL Injection & Veritabanı",
                    icon: "fas fa-database",
                    resources: [
                        { title: "SQL Injection Çeşitleri", url: "https://www.turkhackteam.org/konular/sql-injection-nedir.2043204/", description: "SQLi türleri ve metodolojiler" },
                        { title: "SQL Injection Login Bypass", url: "https://www.turkhackteam.org/konular/sqli-login-bypassi-anlamak.2047405/", description: "Authentication bypass teknikleri" },
                        { title: "SQL Shell Atma Teknikleri", url: "https://www.turkhackteam.org/konular/sql-acikli-siteye-shell-atma.2013820/", description: "Web shell upload metodları" },
                        { title: "PortSwigger SQLi Labs", url: "https://www.turkhackteam.org/konular/portswigger-web-security-academy-sqli-temelleri-lab-1-lab-2-izlenecek-yol.2031527/", description: "SQL injection laboratuvarları" }
                    ]
                },
                {
                    title: "Exploitation & Pentest",
                    icon: "fas fa-bolt",
                    resources: [
                        { title: "Exploit Kodlama Serisi", url: "https://www.turkhackteam.org/konular/exploit-kodlamak-egitim-serisi-1-gercek-senaryo.2050746/", description: "Exploit development eğitimleri" },
                        { title: "Auto Exploit Geliştirme", url: "https://www.turkhackteam.org/konular/auto-exploit-nedir-nasil-yazilir.2052123/", description: "Otomatik exploit yazımı" },
                        { title: "Remote Code Execution", url: "https://www.turkhackteam.org/konular/site-hackleme-rehberi-4.1989338/", description: "RCE zaafiyetleri ve exploit" },
                        { title: "Command Injection", url: "https://www.turkhackteam.org/konular/web-hacking-101-serisi-command-injection.2038421/", description: "Command injection teknikleri" }
                    ]
                },
                {
                    title: "Advanced Web Zaafiyetleri",
                    icon: "fas fa-shield-alt",
                    resources: [
                        { title: "SSRF - Server Side Request Forgery", url: "https://www.turkhackteam.org/konular/ssrf-nedir.2075671/", description: "SSRF zaafiyetleri ve sömürme" },
                        { title: "CSRF - Cross Site Request Forgery", url: "https://www.turkhackteam.org/konular/web-hacking-101-serisi-csrf-final.2038481/", description: "CSRF saldırıları ve korunma" },
                        { title: "IDOR - Insecure Direct Object Reference", url: "https://www.turkhackteam.org/konular/web-hacking-101-serisi-idor.2038475/", description: "Yetki atlama zaafiyetleri" },
                        { title: "SSTI - Server Side Template Injection", url: "https://www.turkhackteam.org/konular/server-side-template-injection-exe-rce-wtf.2048922/", description: "Template injection zaafiyetleri" },
                        { title: "HTML Injection", url: "https://www.turkhackteam.org/konular/web-hacking-101-serisi-html-injection.2038453/", description: "HTML enjeksiyon teknikleri" }
                    ]
                },
                {
                    title: "WordPress & CMS Güvenliği",
                    icon: "fas fa-wordpress",
                    resources: [
                        { title: "WordPress Pentest Temelleri", url: "https://www.turkhackteam.org/konular/basit-seviyede-wordpress-pentest.2052311/", description: "WordPress güvenlik testleri" },
                        { title: "Shell Log Panel", url: "https://www.turkhackteam.org/konular/shell-log-panel-v1-php.2047512/", description: "Web shell yönetim paneli" }
                    ]
                },
                {
                    title: "CTF & Pratik Beceriler",
                    icon: "fas fa-flag",
                    resources: [
                        { title: "TryHackMe Hijack Makinesi", url: "https://www.turkhackteam.org/konular/tryhackme-hijack.2051616/", description: "CTF çözümü ve metodolojisi" },
                        { title: "Yetki Yükseltme Teknikleri", url: "https://www.turkhackteam.org/konular/yetki-yukseltme.2041403/", description: "Privilege escalation metodları" },
                        { title: "Siber İstihbarat Temelleri", url: "https://www.turkhackteam.org/konular/siber-istihbarat-temelleri-1.2018009/", description: "OSINT ve istihbarat toplama" }
                    ]
                }
            ]
        },
        blue: {
            title: "Blue Team Roadmap",
            desc: "Defensive security uzman ekibi.",
            icon: "fas fa-shield-alt",
            categories: [
                {
                    title: "Network Security & Monitoring",
                    icon: "fas fa-shield-virus",
                    resources: [
                        { title: "Network Temelleri ve Güvenlik", url: "https://www.turkhackteam.org/konular/blue-team-stratejisi-bootcamp-bolum-3-network-dedigin-sinyaldir.2061477/", description: "Ağ güvenlik temelleri" },
                        { title: "TCP/IP Modeli ve Protokoller", url: "https://www.turkhackteam.org/konular/basic-network-bilgisi-2.2059556/", description: "Protokol analizi ve güvenlik" },
                    ]
                },
                {
                    title: "Malware Analysis & Forensics",
                    icon: "fas fa-search",
                    resources: [
                        { title: "Statik ve Dinamik Analiz", url: "https://www.turkhackteam.org/konular/statik-ve-dinamik-analiz-1.2076551/", description: "Zararlı yazılım analiz teknikleri" },
                    ]
                }
            ]
        },
        rnd: {
            title: "Ar-Ge Ekibi Roadmap",
            desc: "Forumun yazılım ekibi.",
            icon: "fas fa-flask",
            categories: [
                {
                    title: "Python Geliştirme",
                    icon: "fab fa-python",
                    resources: [
                        { title: "Python Temelleri - Ders 1", url: "https://www.turkhackteam.org/konular/bomba-hep-beraber-python-ogrenelim-1-ders-pourlacapraz-kilic.1885511/", description: "Python programlama temelleri" },
                        { title: "Python Temelleri - Ders 2", url: "https://www.turkhackteam.org/konular/bomba-hep-beraber-python-ogrenelim-2-ders-pourlacapraz-kilic.1886785/", description: "Fonksiyonlar ve modüller" },
                        { title: "Python Ders 3-7 Serisi", url: "https://www.turkhackteam.org/konular/bombahep-beraber-python-ogrenelim-3-ders-pourlacapraz-kilic.1890367/", description: "İleri seviye Python" },
                    ]
                },
                {
                    title: "Web Geliştirme",
                    icon: "fas fa-code",
                    resources: [
                        { title: "JavaScript Sıfırdan İleriye", url: "https://www.turkhackteam.org/konular/sifirdan-ileriye-javascript-serisi.2065960/", description: "Modern JavaScript geliştirme" },
                        { title: "HTML Temelleri", url: "https://www.turkhackteam.org/konular/sifirdan-ileri-seviye-html-0-web-gelistirme-temelleri.2076793/", description: "Web geliştirme temelleri" },
                        { title: "PHP Geliştirme", url: "https://www.turkhackteam.org/konular/sifirdan-ileriye-javascript-serisi.2065960/", description: "Backend development" }
                    ]
                },
                {
                    title: "C# Geliştirme",
                    icon: "fas fa-cube",
                    resources: [
                        { title: "Sıfırdan C# Programlama", url: "https://www.turkhackteam.org/konular/sifirdan-c.2065184/", description: "C# programlama temelleri" }
                    ]
                }
            ]
        },
        media: {
            title: "Medya Ekibi Roadmap",
            desc: "UI/UX tasarım ekibi.",
            icon: "fas fa-palette",
            categories: [
                {
                    title: "Grafik Tasarım",
                    icon: "fas fa-paint-brush",
                    resources: [
                        { title: "Grafik Tasarım Nasıl Yapılır?", url: "https://www.turkhackteam.org/konular/grafik-tasarim-nasil-yapilir.2024325/", description: "Temel tasarım prensipleri" },
                        { title: "UI/UX Tasarım Prensipleri", url: "#", description: "Kullanıcı arayüzü tasarımı" },
                        { title: "Online Arşiv", url: "https://www.turkhackteam.org/konular/grafik-tasarimcinin-online-arsivi.1877196/", description: "Kullanıcı arayüzü tasarımı" },
                        { title: "Grafik Tasarım Üzerinden Nasıl Para Kazanılır?", url: "https://www.turkhackteam.org/konular/grafik-tasarim-uzerinden-nasil-para-kazanilir.1892222/", description: "Kullanıcı arayüzü tasarımı" }
                    ]
                }
            ]
        }
    };
    return roadmaps[team] || roadmaps.red;
}

function renderRoadmap(data, container) {
    let categoriesHTML = '';
    data.categories.forEach((category, index) => {
        let resourcesHTML = '';
        category.resources.forEach(resource => {
            const linkUrl = resource.url === '#' ? 'javascript:void(0)' : resource.url;
            const targetAttr = resource.url === '#' ? '' : 'target="_blank"';
            resourcesHTML += `
                <div class="resource-card">
                    <div class="resource-header">
                        <h4 class="resource-title">${resource.title}</h4>
                        <div class="resource-badge">Yeni</div>
                    </div>
                    <p class="resource-desc">${resource.description}</p>
                    <a href="${linkUrl}" ${targetAttr} class="resource-link">
                        <span>Kaynağı İncele</span>
                        <i class="fas fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            `;
        });
        categoriesHTML += `
            <div class="category" style="animation-delay: ${index * 0.1}s">
                <div class="category-header">
                    <div class="category-title">
                        <i class="${category.icon}"></i>
                        ${category.title}
                    </div>
                    <div class="category-toggle">▼</div>
                </div>
                <div class="category-content">
                    <div class="resources-grid">
                        ${resourcesHTML}
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = `
        <div class="container">
            <div class="roadmap-container">
                <div class="roadmap-header">
                    <div class="roadmap-icon">
                        <i class="${data.icon}"></i>
                    </div>
                    <div>
                        <h2 class="roadmap-title">${data.title}</h2>
                        <p class="roadmap-desc">${data.desc}</p>
                    </div>
                </div>
                <div class="roadmap-categories">
                    ${categoriesHTML}
                </div>
            </div>
        </div>
    `;
}
