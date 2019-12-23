const express = require('express');
const UserRouter = express.Router();
const userModel = require('../models/users');

const bcrypt = require('bcrypt');


//CRUD
//Create
UserRouter.post('/adduser', (req , res) =>{
    const { username, email, password, fullname, phone} = req.body;
    userModel.find({username: username}, (err, dataUsername) => {
        if (dataUsername.length === 0) {
            userModel.find({email: email}, (err, dataEmail) =>{
                if (dataEmail.length === 0) {
                    const hashPassword = bcrypt.hashSync(password, 12);
                    userModel.create({username, email, password: hashPassword, fullname, phone, disabled: false})
                        .then(userCreated =>{
                            // console.log(userCreated);
                            res.status(201).json({
                                success: true,
                                message: "Tạo tài khoản thành công!",
                                data: userCreated,
                            })
                        }).catch(error =>{
                            console.log(error);
                            res.status(500).json({
                                success: false,
                                message: "Tạo tài khoản không thành công!",
                                error,
                            })
                    })
                } else {
                    res.send({
                        success: false,
                        message: "Địa chỉ email đã được sử dụng!"
                    })
                }
            })
        } else {
            res.send({
                success: false,
                message: "Tài khoản đã tồn tại, xin vui lòng chọn tài khoản khác!"
            })
        }
    })
    
    // const hashPassword = bcrypt.hashSync(password, 12);
    // userModel.create({username, email, password: hashPassword, fullname, disabled: false})
    //     .then(userCreated =>{
    //         // console.log(userCreated);
    //         res.status(201).json({
    //             success: true,
    //             message: "Tạo tài khoản thành công!",
    //             data: userCreated,
    //         })
    //     }).catch(error =>{
    //         console.log(error);
    //         res.status(500).json({
    //             success: false,
    //             message: "Tạo tài khoản không thành công!",
    //             error,
    //         })
    // })
});

//Get Info Personal
UserRouter.post('/infopersonal', (req, res) =>{
    const idUser = req.body.idUser
    // console.log(idUser)
    userModel.find({_id: idUser}, (err, dataUser) => {
        if (dataUser.length === 0) {
            return
        } else {
            // console.log(dataUser[0])
            res.send({
                status: true,
                message: "Thông tin tài khoản của bạn",
                infoPersonal: dataUser[0]
            })
        }
    })
})


//get list
UserRouter.get('/getalluser', (req, res) => {
    userModel.find({})
        .then(userList =>{
            res.json({
                success: true,
                data: userList,
            })
        }).catch(err =>{
            console.log(err)
            res.status(500).json({
                success: false,
                err
            });
        });
});

//get one
UserRouter.get('/getoneuser/:id', (req, res) =>{
    console.log(req.params.id)
    userModel.findById(req.params.id)
        .then(oneUser =>{
            res.json({
                success: true,
                data: oneUser
            });
        }).catch(err =>{
            res.status(500).json({
                success: false,
                err
            });
        });
}); 

//update
UserRouter.put('/updatepassword', (req, res) =>{
    const {idUser, newpassword} = req.body;
    const hashPassword = bcrypt.hashSync(newpassword, 12);
    userModel.findByIdAndUpdate(idUser, {password: hashPassword})
        .then(passwordUpdate => {
            res.send({
                success: true,
                message: "Đã đổi mật khẩu thành công!",
            })
        }).catch(err => {
            console.log(err)
        })
})


UserRouter.put('/active', (req, res) =>{
    const {idUser, active} = req.body;
    if (active === false) {
        userModel.findByIdAndUpdate(idUser, {disabled: true})
            .then(dataUser => {
                // console.log(dataUser)
                res.send({
                    success: true,
                    message: "Đã tắt hoạt động của tài khoản " + dataUser.username + " !"
                })
            }).catch(err =>{
                console.log(err);
            })
    } else {
        if (active === true) {
            userModel.findByIdAndUpdate(idUser, {disabled: false})
            .then(dataUser => {
                console.log(dataUser.disabled)
                res.send({
                    success: true,
                    message: "Đã bật hoạt động của tài khoản " + dataUser.username + " !"
                })
            }).catch(err =>{
                console.log(err);
            })
        }
    }
})

UserRouter.put('/changeinfo', (req, res) =>{
    const {idUser, username, fullname, email, phone} = req.body;
    // console.log(req.body);
    userModel.find({username:username}, (err, dataUsername) =>{
        if (dataUsername.length === 1) {
            // console.log(dataUsername[0]._id)
            // console.log(idUser)
            if (dataUsername[0]._id == idUser) {
                userModel.find({email: email}, (err, dataEmail) => {
                    if (dataEmail.length === 1) {
                        if (dataEmail[0]._id == idUser) {
                            userModel.findByIdAndUpdate(idUser, {username: username, fullname: fullname, email: email, phone: phone})
                                .then(() =>{
                                    res.send({
                                        success: true,
                                        message: "Thay đổi thông tin thành công!"
                                    })
                                }).catch(err => {
                                    console.log(err)
                                    res.send({
                                        success: false,
                                        message: "Thay đổi thông tin không thành công!"
                                })
                            })
                        } else {
                            res.send({
                                success: false,
                                message: "Email của bạn đã tồn tại, xin vui lòng sử dụng email khác!"
                            })
                        }
                    } else if (dataEmail.length === 0) {
                        userModel.findByIdAndUpdate(idUser, {username: username, fullname: fullname, email: email, phone: phone})
                            .then(() =>{
                                res.send({
                                    success: true,
                                    message: "Thay đổi thông tin thành công!"
                                })
                            }).catch(err => {
                                console.log(err)
                                res.send({
                                    success: false,
                                    message: "Thay đổi thông tin không thành công!"
                            })
                        })
                    } else {
                        res.send({
                            success: false,
                            message: "Email của bạn đã tồn tại, xin vui lòng sử dụng email khác!"
                        })
                    }
                })
            } else {
                res.send({
                    success: false,
                    message: "Tài khoản của bạn đã tồn tại, xin vui lòng sử dụng tài khoản khác!"
                })
            }
        } else if(dataUsername.length === 0){
            userModel.find({email: email}, (err, dataEmail) =>{
                if (dataEmail.length === 1) {
                    if (dataEmail[0]._id == idUser) {
                        userModel.findByIdAndUpdate(idUser, {username: username, fullname: fullname, email: email, phone: phone})
                            .then(() =>{
                                res.send({
                                    success: true,
                                    message: "Thay đổi thông tin thành công!"
                                })
                            }).catch(err => {
                                console.log(err)
                                res.send({
                                    success: false,
                                    message: "Thay đổi thông tin không thành công!"
                            })
                        })
                    } else {
                        res.send({
                            success: false,
                            message: "Email của bạn đã tồn tại, xin vui lòng sử dụng email khác!"
                        })
                    }
                } else if (dataEmail.length === 0) {
                    userModel.findByIdAndUpdate(idUser, {username: username, fullname: fullname, email: email, phone: phone})
                        .then(() =>{
                            res.send({
                                success: true,
                                message: "Thay đổi thông tin thành công!"
                            })
                        }).catch(err => {
                            console.log(err)
                            res.send({
                                success: false,
                                message: "Thay đổi thông tin không thành công!"
                        })
                    })
                } else {
                    res.send({
                        success: false,
                        message: "Email của bạn đã tồn tại, xin vui lòng sử dụng email khác!"
                    })
                }
            })
        } else {
            res.send({
                success: false,
                message: "Tài khoản của bạn đã tồn tại, xin vui lòng sử dụng tài khoản khác!"
            })
        }
    })
})

//delete



module.exports = UserRouter;