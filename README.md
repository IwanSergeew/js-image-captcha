
# Javascript image captcha

Captcha with images for protecting forms from bots.

## Usage/Examples

```javascript
<head>
  ...
  <script src="assets/js/captcha.js"></script>
  ...
</head>

<body>
  <form id="someForm">
    ...
    <div id="captcha" class="captcha"></div>
    ...
  </form>
  ...
  <script>
    const captcha = new Captcha({
        id: 'captcha'
    });

    const someForm = document.getElementById('someForm');
    someForm.addEventListener('submit', (e) => {
        if(!captcha.isValid()) {
            e.preventDefault();
            alert('Capcha not valid.');
        }
    });
  </script>
</body>
```

## Screenshots

![App Screenshot](https://gcdnb.pbrd.co/images/9eZvYxY9cpVL.png?o=1)

