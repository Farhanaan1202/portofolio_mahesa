document.addEventListener("DOMContentLoaded", () => {
    
    // Register GSAP Plugins secara eksplisit
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================================================
       SMOOTH SCROLL SYSTEM (Lenis Setup)
       ========================================================================== */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Kunci scroll saat user berada di Opening Screen awal
    lenis.stop();

    /* ==========================================================================
       NETFLIX CINEMATIC INTRO TIMELINE SYSTEM
       ========================================================================== */
    const tlNetflix = gsap.timeline({
        onComplete: () => {
            // Hancurkan elemen intro setelah animasi selesai agar menghemat memori DOM
            const netflixIntro = document.getElementById("netflix-intro");
            if (netflixIntro) netflixIntro.remove();
        }
    });

    tlNetflix.to(".netflix-text-wrapper", {
        duration: 0.8,
        opacity: 1,
        scale: 1,
        ease: "power2.out"
    })
    .to(".n-letter", {
        duration: 0.1,
        x: () => Math.random() * 2 - 1,
        y: () => Math.random() * 2 - 1,
        repeat: 5,
        yoyo: true,
        ease: "none"
    }, "+=0.2")
    .to(".netflix-text-wrapper", {
        duration: 1.2,
        scale: 45,
        transformOrigin: "50% 50%", // Zoom-in menembus bagian tengah nama Anda
        opacity: 0,
        blur: 15,
        ease: "power4.in"
    })
    .to("#netflix-intro", {
        duration: 0.6,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.3");

    /* ==========================================================================
       OPENING SCREEN TO PORTFOLIO ENTER ANIMATION SEQUENCE
       ========================================================================== */
    const btnEnter = document.getElementById("btn-enter");
    
    if (btnEnter) {
        btnEnter.addEventListener("click", () => {
            const tlEnter = gsap.timeline({
                onComplete: () => {
                    const openingScreen = document.getElementById("opening-screen");
                    const mainWrapper = document.getElementById("main-wrapper");
                    
                    if (openingScreen) {
                        openingScreen.style.pointerEvents = "none"; 
                        openingScreen.style.display = "none"; 
                    }
                    
                    if (mainWrapper) {
                        // Hancurkan total pembatas visibilitas CSS agar tautan jangkar aktif
                        mainWrapper.classList.remove("main-content-hidden");
                        mainWrapper.style.visibility = "visible";
                        mainWrapper.style.opacity = "1";
                    }

                    lenis.start(); // Buka kunci scroll smooth Lenis
                    triggerHeroSequence(); // Mulai rangkaian animasi masuk Hero Section
                }
            });

            // Animasi riak (ripple) pada tombol enter
            tlEnter.to(".ripple", {
                duration: 0.4,
                scale: 40,
                opacity: 0.1,
                ease: "power2.out"
            })
            // Fade-out layar pembuka
            .to("#opening-screen", {
                duration: 0.8,
                opacity: 0,
                ease: "power3.inOut"
            }, "-=0.2")
            // Efek kamera zoom-in untuk mengungkap konten utama
            .fromTo("#main-wrapper", {
                opacity: 0,
                scale: 1.05,
                visibility: "hidden"
            }, {
                duration: 1.2,
                opacity: 1,
                scale: 1,
                visibility: "visible",
                ease: "power4.out"
            }, "-=0.6");
        });
    }

    /* ==========================================================================
       HERO ANIMATION TIMELINE SEQUENCE
       ========================================================================== */
    function triggerHeroSequence() {
        const tlHero = gsap.timeline();

        tlHero.from(".hero-intro", {
            duration: 0.6,
            x: -50,
            opacity: 0,
            ease: "power3.out"
        })
        .from(".hero-im", {
            duration: 0.5,
            opacity: 0,
            ease: "power2.out"
        }, "-=0.3")
        .from(".hero-name", {
            duration: 0.8,
            y: 40,
            opacity: 0,
            ease: "power4.out"
        }, "-=0.2")
        .add(() => {
            runTypingEffect("Cyber Security", document.getElementById("typed-text"));
        }, "-=0.2")
        .from(".hero-desc", {
            duration: 0.7,
            y: 20,
            opacity: 0,
            ease: "power3.out"
        }, "+=0.8")
        .from(".hero-btn-group .btn", {
            duration: 0.5,
            y: 15,
            opacity: 0,
            stagger: 0.15,
            ease: "power2.out"
        }, "-=0.4")
        .from(".profile-wrapper", {
            duration: 1,
            x: 60,
            opacity: 0,
            ease: "power4.out"
        }, "-=0.8");

        initAmbientDynamics();
    }

    function runTypingEffect(text, targetElement) {
        if (!targetElement) return;
        let index = 0;
        targetElement.innerHTML = "";
        const interval = setInterval(() => {
            if (index < text.length) {
                targetElement.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 60);
    }

    /* ==========================================================================
       AMBIENT DYNAMICS (Parallax, Floating & Scroll Reactive Controls)
       ========================================================================== */
    function initAmbientDynamics() {
        gsap.to(".profile-avatar", { y: -12, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });

        if (window.innerWidth > 991.98) {
            document.addEventListener("mousemove", (e) => {
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                const dx = (e.clientX - cx) / cx;
                const dy = (e.clientY - cy) / cy;

                gsap.to(".target-parallax", { duration: 0.5, x: dx * 20, y: dy * 20, rotateX: -dy * 5, rotateY: dx * 5, ease: "power1.out" });
                gsap.to(".blob-container", { duration: 1, x: dx * 40, y: dy * 40, ease: "power2.out" });
            });
        }
    }

    window.addEventListener("scroll", () => {
        const nav = document.querySelector(".premium-nav");
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add("scrolled");
            } else {
                nav.classList.remove("scrolled");
            }
        }
    });

    /* ==========================================================================
       SCROLLTRIGGER ENGINE - UNIQUE SECTION ARCHITECTURES
       ========================================================================== */
    gsap.from(".bento-item", {
        scrollTrigger: {
            trigger: "#about",
            start: "top 75%",
            toggleActions: "play none none none"
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        scale: 0.95,
        stagger: 0.15,
        ease: "power3.out"
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: "#skills",
            start: "top 70%"
        }
    })
    .from(".skill-card-wrapper", { duration: 0.6, y: 30, opacity: 0, stagger: 0.15, ease: "power2.out" })
    .to(".progress-bar-fill", { duration: 1, scaleX: 1, stagger: 0.1, ease: "power4.out" }, "-=0.3");

    const projectRows = document.querySelectorAll(".project-reveal-row");
    projectRows.forEach((row) => {
        gsap.from(row, {
            scrollTrigger: {
                trigger: row,
                start: "top 80%"
            },
            duration: 1,
            x: 100,
            opacity: 0,
            ease: "power4.out"
        });
    });

    gsap.from(".timeline-line", {
        scrollTrigger: {
            trigger: "#experience",
            start: "top 70%",
            end: "bottom 60%",
            scrub: true
        },
        scaleY: 0
    });

    gsap.from(".timeline-item", {
        scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 75%"
        },
        duration: 0.6,
        y: 40,
        opacity: 0,
        stagger: 0.3,
        ease: "power2.out"
    });

    const heading = document.querySelector(".contact-heading");
    if (heading) {
        const words = heading.innerText.split(" ");
        heading.innerHTML = words.map(word => `<span class='d-inline-block contact-word' style='opacity:0; transform:translateY(20px); margin-right:12px;'>${word}</span>`).join("");

        gsap.timeline({
            scrollTrigger: {
                trigger: "#contact",
                start: "top 75%"
            }
        })
        .to(".contact-word", { duration: 0.5, opacity: 1, y: 0, stagger: 0.1, ease: "power3.out" })
        .from(".social-wrapper", { duration: 0.6, scale: 0.7, opacity: 0, stagger: 0.08, ease: "back.out(1.5)" }, "-=0.2");
    }

    const btnToTop = document.getElementById("btn-back-to-top");
    if (btnToTop) {
        btnToTop.addEventListener("click", () => {
            lenis.scrollTo(0, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    }

    /* ==========================================================================
       SMOOTH NAVIGATION LINK ANCHORS (LENIS INTEGRATION)
       ========================================================================== */
    const navLinks = document.querySelectorAll(".premium-nav .nav-link, .hero-btn-group .btn");
    
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault(); 
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    lenis.start(); 
                    
                    const openingScreen = document.getElementById("opening-screen");
                    const mainWrapper = document.getElementById("main-wrapper");
                    
                    if (openingScreen && openingScreen.style.display !== "none") {
                        openingScreen.style.pointerEvents = "none";
                        openingScreen.style.display = "none";
                        
                        if (mainWrapper) {
                            mainWrapper.classList.remove("main-content-hidden");
                            mainWrapper.style.visibility = "visible";
                            mainWrapper.style.opacity = "1";
                            mainWrapper.style.scale = "1";
                        }
                        
                        triggerHeroSequence();
                    }

                    // Eksekusi perpindahan halaman smooth oleh Lenis
                    lenis.scrollTo(targetElement, {
                        duration: 1.2,
                        offset: -80, 
                        ease: "power4.out"
                    });
                }
            }
        });
    });

    /* ==========================================================================
       POPUP IMAGE PREVIEW CONTROL LAYER (FORCED ACTION ENGINE)
       ========================================================================== */
    const profileAvatar = document.querySelector(".profile-avatar");
    const imageModalEl = document.getElementById('imageViewerModal');
    
    if (profileAvatar && imageModalEl) {
        // Inisialisasi objek modal secara eksplisit lewat modul JavaScript Bootstrap
        const bsModal = new bootstrap.Modal(imageModalEl);

        // Pemicu Klik Paksa (Menghindari kegagalan deteksi otomatis oleh atribut HTML)
        profileAvatar.addEventListener("click", (e) => {
            e.preventDefault();
            bsModal.show(); // Tampilkan gambar satu layar penuh
        });

        // Manajemen Pengunci Scroll Lenis saat foto aktif
        imageModalEl.addEventListener('show.bs.modal', () => {
            lenis.stop(); // Matikan scroll latar belakang halaman
        });

        imageModalEl.addEventListener('hidden.bs.modal', () => {
            lenis.start(); // Hidupkan kembali scroll saat ditutup
        });
    }
});