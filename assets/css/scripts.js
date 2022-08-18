const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)
const durations = $$('.audio-display')
// List

const playlist = $('.playlist')
const openPlaylist = $('.btn-list')
const closePlaylist = $('.header-close')

// LoadCurrentSong
const title = $('.title')
const author = $('.author')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
// Play
const playBtn = $('.btn-play')
const player = $('.player')
// Progress
const progressBar = $('.progress-bar')
const progress = $('.progress')
// Volume
const volumeIcon = $('.volume-icon')
const volumeBar = $('.volume-bar')
const volume = $('.volume')
//Timer 
const begin = $('.begin')
const end = $('.end')
const wave = $$('.wave')
// List Music
let isHoldingVolume = false
let isHoldingProgress = false
// Btn
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const rdBtn = $('.btn-ramdom')
const songFlowStates = ['repeat','repeat_one','shuffle']
const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [
    {
        title: 'The Nights',
        author: 'Avicii',
        path: './assets/music/the_nights.mp3',
        image: './assets/img/the_nights.jpg',
    },
    {
        title:'Stressed Out',
        author:'twenty one pilots',
        path:'./assets/music/stress_out.mp3',
        image:'./assets/img/stress.jpg',
    },
    {
        title:'Boulevard',
        author:'Green Day',
        path: './assets/music/boulevard.mp3',
        image: './assets/img/boulevard.jpg',
    },
    {
        title:'Happy For You',
        author:'Lucas Gramah - Vũ',
        path: './assets/music/happy_for_you.mp3',
        image:'./assets/img/happy_for_you.jpg',
    },
    {
        title:'Circles',
        author:'Post Malone',
        path: './assets/music/Circles.mp3',
        image:'./assets/img/Circles.jpg',
    },
    {
        title:'Ride',
        author:'twenty one pilots',
        path: './assets/music/ride.mp3',
        image:'./assets/img/ride.jpg',
    },
    {
        title:'Closer',
        author:'The Chainsmokers',
        path: './assets/music/closer.mp3',
        image:'./assets/img/closer.jpg',
    },
    {
        title:'Congratulations',
        author:'Post Malone',
        path: './assets/music/congratulations.mp3',
        image:'./assets/img/congratulations.jpg',
    },
    {
        title:'We Dont Talk Anymore',
        author:'Charlie Puth',
        path: './assets/music/we_dont.mp3',
        image:'./assets/img/we_dont.jpg',
    },
    ],
    // Setting timer format
   timerFormat(duration) {
    const rounded = Math.floor(duration);
    return `${Math.floor(rounded/60) >= 10 ? Math.floor(rounded/60) : '0' + Math.floor(rounded/60)}:${rounded%60 >= 10 ? rounded%60 : '0' + rounded%60}`;
 },
 
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <li class="playlist-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="playlist-thumb" style="background-image: url('${song.image}');"></div>
                    <div class="song-info">
                        <span class="playlist-title">${song.title}</span>
                        <span class="playlist-author">${song.author}</span>
                    </div>
                    <audio class="duration-display" preload="metadata" src=${song.path}></audio>
                    <div class="wave"></div>
                </li>
            </ul>
        </div>
        `;
        });
        $('.playlist-wrapper').innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    setChangeSong(newIndex) {
    this.currentIndex = newIndex;
    this.loadCurrentSong();
    audio.play();
    },

    // Xử lý khi click play
    handleEvents: function() {
        const isRandom = false;
        const _this = this
        const playListItems = $$('.playlist-item');
        // Pause - Play button
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            thumbAnimation.play();
        }
        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            thumbAnimation.pause();
        }

        // Updates song's duration when audio's metadata first update
      audio.onloadedmetadata = () => {
        begin.innerText = this.timerFormat(audio.currentTime);
        end.innerText = this.timerFormat(audio.duration);
     }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration) * 100
                progress.style.width = `${progressPercent}%` 
                $('.begin').innerText = _this.timerFormat(audio.currentTime)
            }
        }


        // Next or prev click
        nextBtn.onclick = () => {
            if(_this.isRandom) {
                _this.playRandomSong() 
            } else if (this.currentIndex === this.songs.length-1) this.setChangeSong(0);
            else this.setChangeSong(this.currentIndex + 1);
            _this.render()
        }
        //  prev
        prevBtn.onclick = () => {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else if(this.currentIndex === 0) this.setChangeSong(this.songs.length-1);
            else this.setChangeSong(this.currentIndex - 1);
            _this.render()

         }

        // Volume
        audio.onvolumechange = function() {
            if(audio.volume >= 0.5){
                volumeIcon.classList.add('high')
                volumeIcon.classList.remove('xmark', 'low')
            } else if(audio.volume < 0.02) {
                volumeIcon.classList.add('xmark')
                volumeIcon.classList.remove('high', 'low')
            } else {
                volumeIcon.classList.add('low')
                volumeIcon.classList.remove('xmark', 'high')
            }
            $('.volume').style.width = `${audio.volume*100}%`;
        }
        

        // Thumb animation
        const thumbAnimation = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity,
        })
        //Open playlist
        openPlaylist.onclick = () => {
            playlist.classList.add('active');
        }
        closePlaylist.onclick = () => {
            playlist.classList.remove('active');
        }
        // Animation paused when initialized
        thumbAnimation.pause();
        // btn random
        rdBtn.onclick = () => {
            _this.isRandom = !_this.isRandom;
            rdBtn.classList.toggle("shuffle", _this.isRandom);
        }
        // Next music khi audio ended
        audio.onended = () => {
            nextBtn.click()
        }
        // lắng nghe click playlist
        playlist.onclick = (e) => {
            const songNode = e.target.closest('.playlist-item:not(.active')
            if(songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                audio.play()
                _this.render()
            }
        }

        // Mouse
        window.onmouseup = () => {
            isHoldingProgress = false;
            isHoldingVolume = false;
         }
        // Xử lí khi tua sound
        progressBar.onmousedown = (e) => {
            isHoldingProgress = true;
            audio.currentTime = (e.offsetX/e.target.offsetWidth) * audio.duration;
         }
         progressBar.onmousemove = (e) => {
            if(isHoldingProgress) audio.currentTime = (e.offsetX/e.target.offsetWidth) * audio.duration;
        }
         // Xử lí khi tua volume
        volumeBar.onmousedown = function(e) { 
            isHoldingVolume = true;
            audio.volume = (e.offsetX/e.target.offsetWidth)
        }
        volumeBar.onmousemove = function(e) {
            if(isHoldingVolume) audio.volume = e.offsetX/e.target.offsetWidth;
        }
    },
    loadCurrentSong: function() {
        title.textContent = this.currentSong.title
        author.textContent = this.currentSong.author
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        audio.play()
    },
    
    
    start: function() {
        this.defineProperties()

        this.handleEvents()
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        this.render()
        audio.volume = 0.7;
        
    }

}



app.start()
