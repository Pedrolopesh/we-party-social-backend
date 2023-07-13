const User = require('../database/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const webpush = require('web-push');
const nodemailer = require('nodemailer');
require('dotenv').config();

const response = require('../utils/response');


module.exports = {

    create(req, res){

        const { name, email, password } = req.body

        if(!name || !email || !password){
            return response(res, 400, { success: false, message: 'Please fill in all fields' })
        }

        User.findOne({ email:email })
        .then(user => {
            if(user){
                return response(res, 401, { success: false, message: 'User Alredy exist' })
            }
            else{
                const newUser = new User({
                    name,
                    email,
                    password,
                    img_profile:"",
                    confirmCode:"",
                    status:"active"
                })

                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;

                    newUser.save()
                    .then(user => {
                        function generateToken(params={}){
                            return jwt.sign(params, process.env.AUTH_SECRET, {
                                expiresIn: 2155926
                            })
                        }

                        res.status(201).send({ success: true, _id: user._id, token: generateToken({ id: user.id }) })
                    })

                    .catch(err => {
                        console.log(err)
                        return res.status(400).send({ success: false, error: err })
                    })
                }))
            }
        })
    },

    login(req,res){
        const { email, password }= req.body

        //CHECK IF SEND SOMETHING ON BODY.
        if(!email){
            res.status(400).send({ success: false, message: 'Please fill in all necessary fields' })
        }
        User.findOne({ email: email }).select('+password')
        .then((user)=> {

            //CHECK IF USER EXIST
            if(!user){
                return res.status(403).send({ success: false, error: "email don't exist, try register first" })
            }
            else{
                bcrypt.compare(password, user.password)
                .then( (isMacth) => {

                    //CHECK IF PASSWORD IS CORRET
                    if(!isMacth){
                        return res.status(400).json({ success: false, message: "User or password do not macth" })
                    }

                    //GENERATE TOKEN SESSION AND RETURN WITH USE ID
                    else{
                        function generateToken(params={}){
                            return jwt.sign(params, process.env.AUTH_SECRET,{
                                expiresIn: 2155926
                            })
                        }
                        return res.status(200).json({ success: true, user_id: user._id, token: generateToken({ id: user.id }) })
                    }
                })
            }
        })
    },

    index(req, res){
        User.find((err, docs) => {
            if (err) return res.json(err)

            res.json(docs)
        })
    },


    //NECESSÁRIO ARRUMAR ESSA FUNÇÃO
    async update(req, res) {

        const { name } = req.body
        const userId = req.params.id;

        // const user = await User.findById(data.user_id)

        if(!name && !userId){
            return res.send({ message: 'Please fill in all fields'})
        }

        const locateUser = await User.findById(userId).catch(err => { console.log(err); return res.status(400).json({ success: false, message: "User not found", error: err }) })

        if(!locateUser){console.log(locateUser); return res.status(400).json({ success: false, message: "User not found" })}

        const userUpdated = await User.findByIdAndUpdate(userId, {
            name,
        }).catch(err => { console.log(err); return res.send({ success: true, error: 'error on update user', data: err }) })

        return res.send({ success: true, message: 'succes on update user', data: userUpdated })
    },

    //NECESSÁRIO ARRUMAR ESSA FUNÇÃO
    async updateImage(req, res) {

        const { img_profile } = req.body
        const userId = req.params.id;

        // const user = await User.findById(data.user_id)

        if(!img_profile || !userId){
            return res.send({ message: 'Please fill in all fields'})
        }

        const locateUser = await User.findById(userId).catch(err => { console.log(err); return res.status(400).json({ success: false, message: "User not found", error: err }) })

        if(!locateUser){console.log(locateUser); return res.status(400).json({ success: false, message: "User not found" })}

        const userUpdated = await User.findByIdAndUpdate(userId, {
            img_profile,
        }).catch(err => { console.log(err); return res.send({ success: true, error: 'error on update user', data: err }) })

        return res.send({ success: true, message: 'succes on update user', data: userUpdated })
    },

    //ARRUMAR A FUNÇÃO PARA RETORNAR URL DE MANEIRA QUE RESPEITE O AWAIT
    async upLoadUserImage(req, res){
        const file = req.files.photo
        const user = req.body.user_id

        const cloudinaryApi = await cloudinary.uploader.upload(file.tempFilePath).catch(err => {
            return res.send({ sucess: false, error: err })
        })

        console.log('cloudinaryApi')
        console.log(cloudinaryApi)

        if(cloudinaryApi){
            const userFind = await User.findByIdAndUpdate(user, {
                img_profile:cloudinaryApi.url
            })
            .catch(err => {
                console.log(err)
                return res.send({ sucess: true, error: 'error on update user', data: err })
            })

            return res.send({ sucess: true, message: 'succes on update user image profile', data: userFind })
        }
    },

    async find(req, res){
        const id = req.params.id;

        const userFind = await User.findById(id).catch(err => {
            console.log(err)
            return err
        })
        
        return res.status(201).send({ sucess: true, content: userFind})
    },

    async subscribewebpush(req, res) {
        const subscription = req.body;
        res.status(201).send({ sucess: true, message: 'subscription created'})

        const payload = JSON.stringify({ title: 'Push test' })
        webpush.sendNotification(subscription, payload).catch((err) => console.log(err))

    },

    async forgotPassword(req, res) {
        const { email } = req.body

        if(!email){
            return res.send({ message: 'Please fill in all fields'})
        }

        const locateUser = await User.findOne({ email:email }).catch(err => { console.log(err); return res.status(400).json({ success: false, message: "User not found", error: err }) })
        if(!locateUser){console.log(locateUser); return res.status(400).json({ success: false, message: "User not found" })}


        
        console.log('locateUser', locateUser)
        
        randomIndex = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        
        generatedLink = `https://thechat-app.netlify.app/#/recovery/password/${randomIndex}`

        await User.findByIdAndUpdate(locateUser._id,{
            $set:{
                confirmCode: randomIndex
            }
        }).catch(err => { console.log(err); return res.status(201).send({ success: false, error: err })})

        const output = `            
        <div style="max-width: 100%; width: 100%; border: 1px solid; display: block; margin-left: auto; margin-right: auto;">
            <img src="https://res.cloudinary.com/publi-node-uploads/image/upload/v1632195138/portfolio/the-chat-app-email-logo_pq5nal.png" alt="link leito" style="max-width: 100%; width: 30%; display: block; margin-left: auto; margin-right: auto; margin-top: 20px; margin-bottom: 20px">
            <div style="background-color: #ff709f; padding: 13px">
                <h3 style="font-size: 30px; color: white; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Não se preocupe 😄</h3>
            </div>

            <div style="padding: 20px; background-color: #f7f7f7">
                <ul style="margin-top: 20px; list-style-type: none; text-align: center">
                    <p style="text-align: start; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Olá, ${locateUser.name}</p>
                    <p style="text-align: start; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Recebemos seu pedido para trocar sua senha do the chat. </p>
                    <p style="text-align: start; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin-bottom: 30px;">insira o código abaixo para efetuar a troca ou clique no link</p>

                    <span style="background-color: #ffc4d8; padding: 10px; border: 1px solid #ff6397; border-radius: 6px;"> ${randomIndex} </span>

                    <a href="${generatedLink}" style="margin-top: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; color: #ff6397; display: block;"> ${generatedLink} </a>

                    <p style="margin-top: 20px; text-align: start; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;" >Não pediu alteração ?</p>
                    <p style="text-align: start; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Caso você não tenha solicitado a alteração de senha, <a href="mailto: ${process.env.NODEMAILER_EMAIL}" style="text-decoration: none; color: #ff6397; "> entre em contato conosco </a> </p>

                </ul>
            </div>
        </div>
        `

        console.log({
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        })

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            }
        });

        var mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: req.body.email,
            subject: '[THE-CHAT-APP] Mensagem de contato',
            html: output
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);

            res.send({
                success: false,
                message: 'Erro ao enviar email'
            })

        } else {
            console.log('info:' + info.response);
            res.send({
                success: true,
                message: 'Email enviado para ' + req.body.email,
                info: info
            })
        }
       });

    },


    async confirmUserCode(req, res){
        const { code, email } = req.body

        if(!code || !email) return res.status(400).send({ success: false, message: 'Please fill in all fields' })

        const userLocate = await User.findOne({ email:email })
        if(!userLocate) return res.status(404).send({ success: false, message:'User not found' })

        if(code === userLocate.confirmCode){
            return res.status(200).send({ success: true, message:'corrent_pin', userLocate: userLocate })
        }else{
            return res.status(404).send({ success: false, message:'wrong_pin' })
        }

    },

    async updateUserPassword(req, res){
        const { code, email, password, confirmPassword } = req.body

        if(!code || !email || !password || !confirmPassword) return res.status(400).send({ success: false, message: 'Please fill in all fields' })

        const userLocate = await User.findOne({ email:email })
        if(!userLocate){
            return res.status(404).send({ success: false, message:'User not found' })
        }

        if(code !== userLocate.confirmCode){
            return res.status(404).send({ success: false, message:'wrong_pin' })
        }

        if(password !== confirmPassword){
            return res.status(404).send({ success: false, message:`passwords don't macth` })
        }

        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(password, salt, async (err, hash) => {
            if(err) throw err;
            // password = hash;

            const updatedUser = await User.findByIdAndUpdate(userLocate._id,{
                $set:{
                    password: hash
                }
            }).catch(err => { console.log(err); return res.status(201).send({ success: false, error: err })})

            if(updatedUser){

                function generateToken(params={}){
                    return jwt.sign(params, process.env.AUTH_SECRET, {
                        expiresIn: 2155926
                    })
                }
                
                return res.status(201).send({ success: true, id: userLocate._id, token: generateToken({ id: userLocate._id }) })
            }

        }))
        
        // bcrypt.compare(password, userLocate.password)
    }
}