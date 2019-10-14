const express = require('express');
require('./db/mongoose');
const routerUser = require('./router/user');
const routerTask = require('./router/task');
const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a Word document'))
        }

        cb(undefined, true);
    }
})

const app = express();

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

app.use(express.json());
app.use(routerUser);
app.use(routerTask);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server listen on port: ', port);

})