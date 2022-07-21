class Captcha {
    #valid;
    #path;
    images = {
        'motorcycle': [
            '1.jpg',
            '2.jpg',
            '3.jpg',
            '4.jpg'
        ],
        'car': [
            '5.jpg',
            '5.jpg',
            '5.jpg',
            '5.jpg'
        ],
        'boat': [
            '6.png',
            '6.png',
            '6.png',
            '6.png'
        ],
        'cat': [
            '7.jpg',
            '7.jpg',
            '7.jpg',
            '7.jpg'
        ],
        'other': [
            '8.jpg',
            '8.jpg',
            '8.jpg',
            '8.jpg'
        ]
    }

    constructor({
        id,
        path = 'assets/img/captcha/'
    }) {
        if(!id) return;
        this.el = document.getElementById(id);
        if(!this.el) return;
        this.#path = path;
        this.#valid = false;
        this.generateCaptcha();
    }
    
    generateCaptcha = () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${this.el.id}cb`;
        const label = document.createElement('label');
        label.innerHTML = 'Captcha';
        label.setAttribute('for', `${this.el.id}cb`);
        this.el.append(checkbox, label);
        checkbox.addEventListener('click', this.captchaOpenEvent);
    }

    captchaOpenEvent = (e) => {
        if(e) e.preventDefault();

        if(document.getElementById('captchaModal')) return;

        this.correctImages = new Array();

        let categories = Object.keys(this.images);
        const categoryIndex = this.getRandomNumber(0, categories.length-2);
        const imagesArr = structuredClone(this.images);
        const chosenCategoryArr = [...imagesArr[categories[categoryIndex]]];
        delete imagesArr[categories[categoryIndex]];
        
        let displayedImagesArr = new Array();
        for(let i = 0; i < 3; i++) {
            displayedImagesArr.push(chosenCategoryArr.splice(this.getRandomNumber(0, chosenCategoryArr.length-1), 1));
        }
        let curCategory;
        categories.splice(categoryIndex, 1);
        for(let i = 0; i < 9; i++) {
            curCategory = this.getRandomNumber(0, categories.length-1);
            if(!imagesArr[categories[curCategory]].length) {
                delete imagesArr[categories[curCategory]];
                categories.splice(curCategory, 1);
                i--;
                continue;
            }
            displayedImagesArr.push(imagesArr[categories[curCategory]].splice(this.getRandomNumber(0, imagesArr[categories[curCategory]].length-1), 1));
        }

        this.modal = document.createElement('div');
        this.modal.classList = 'captcha-modal';
        this.modal.id = 'captchaModal';

        const modalHead = document.createElement('div');
        modalHead.classList = 'modal-head';

        const label = document.createElement('label');
        label.innerHTML = `To verify that you are not a robot click on the images containing a <strong>${Object.keys(this.images)[categoryIndex]}</strong>`;
        
        modalHead.append(label);

        const modalBody = document.createElement('div');
        modalBody.classList = 'modal-body';
        let n = displayedImagesArr.length, img, imgContainer, i, correctNum = 3;
        while(n) {
            i = Math.floor(Math.random() * n--);
            imgContainer = document.createElement('div');
            imgContainer.classList = 'img-container';
            imgContainer.setAttribute('data-imgid', n);
            imgContainer.addEventListener('click', this.imageContainerClick);
            if(i < correctNum) {
                correctNum--;
                this.correctImages.push(n);
            }
            img = document.createElement('img');
            img.src = this.#path + displayedImagesArr.splice(i, 1)[0];
            imgContainer.append(img);
            modalBody.append(imgContainer);
        }
        
        const modalFoot = document.createElement('div');
        modalFoot.classList = 'modal-foot';

        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'Verify';
        button.addEventListener('click', this.onVerifyButtonClick);
        modalFoot.append(button);
        
        this.modal.append(modalHead);
        this.modal.append(modalBody);
        this.modal.append(modalFoot);
        document.body.append(this.modal);
    }

    onVerifyButtonClick = (e) => {
        if(this.validate()) {
            this.modal.remove();
            this.el.querySelector(`#${this.el.id}cb`).checked = true;
            this.#valid = true;
        }
        else {
            this.modal.remove();
            this.captchaOpenEvent();
            let label = this.modal.querySelector('.modal-head label.error');
            if(label) label.remove();
            label = document.createElement('label');
            label.classList = 'error';
            label.innerHTML = 'Wrong images selected. Please try again.';
            this.modal.querySelector('.modal-head').prepend(label);

            
        }
    }

    isValid = () => {
        return this.#valid;
    }

    validate = () => {
        const imageContainers = this.modal.querySelectorAll('.modal-body .img-container');
        let imageId, selected;
        for(let i = 0; i < imageContainers.length; i++) {
            imageId = this.correctImages.includes(parseInt(imageContainers[i].getAttribute('data-imgid')));
            selected = imageContainers[i].classList.contains('selected');
            if((imageId && !selected) || (!imageId && selected)) return false;
        }
        return true;
    }

    imageContainerClick = (e) => {
        e.currentTarget.classList.toggle('selected');
    }

    getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shuffleArray = (arr) => {
        let copy = [], n = arr.length, i;
        while (n) {
            i = Math.floor(Math.random() * n--);
            copy.push(arr.splice(i, 1)[0]);
        }
        return copy;
    }
}