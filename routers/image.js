const fs = require('fs');
const express = require('express');
const ImageRouter = express.Router();
const imageModel = require('../models/images');
const multer = require('multer');
const md5File = require('md5-file');
const userModel = require('../models/users');
const {imageContract, web3} = require('../web3');

//CRUD

//Create
//upload image
const imageUploader = multer({ dest: 'ImageUpload/' })

ImageRouter.post('/uploadimage', imageUploader.single('uploadimage'), (req, res) => {
    const processedFile = req.file || {}; // MULTER xử lý và gắn đối tượng FILE vào req
    let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload
    orgName = orgName.trim().replace(/ /g, "-")
    const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
    // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
    const newFullPath = `${fullPathInServ}-${orgName}`;
    fs.renameSync(fullPathInServ, newFullPath);
    const idUser = req.body.uploadimage;
    // console.log(req.body);
    md5File(newFullPath, async (err, hashImage) => {
        if (err) throw err
        console.log("mã hash upload là: " + hashImage)
        await imageContract.methods.getImage().call()
            .then(async (result)=>{
                const arrayImage = result.map(a =>{
                    return Object.assign({}, a)
                })
                // console.log(arrayImage);
                for (let index = 0; index < arrayImage.length; index++) {
                    const element = arrayImage[index];
                    if(element._hashImage === hashImage){
                        console.log("Ảnh của bạn đã có trên blockchain");
                        fs.unlinkSync(newFullPath);
                        console.log("đã xóa ảnh trong folder ImageCheck")
                        res.send({
                            success: false,
                            message: "Ảnh của bạn đã có trên Blockchain"
                        })
                        return
                    } else {
                        if (index === arrayImage.length - 1 && element._hashImage !== hashImage) {
                            console.log("Ảnh của bạn chưa có trên Blockchain")
                            const accounts = await web3.eth.getAccounts();
                            await imageContract.methods.addImage(idUser, hashImage).send({from:accounts[0], gas: "1000000"}, function(error, transactionHash){
                                if (error) throw error
                                console.log("Mã giao dịch là: " + transactionHash);
                                imageModel.create({idUser, nameImage: orgName, hashImage, transactionHash})
                                    .then(imageCreated =>{
                                        console.log("Đã lưu giao dịch vào DB")
                                        res.status(201).json({
                                            success: true,
                                            message: "Đã tải ảnh lên thành công!",
                                            data: imageCreated,
                                        })
                                    }).catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            success:false,
                                            message: "Tải ảnh lên không thành công",
                                            err,
                                        })
                                    })
                            })
                        }
                    }
                }
            }).catch(err => {
                console.log(err)
            })
      })
})

 
// Check Image
const imageChecker = multer({ dest: 'ImageCheck/' })

ImageRouter.post('/checkimage', imageChecker.single('checkimage'), (req, res) => {
    const processedFile = req.file || {}; // MULTER xử lý và gắn đối tượng FILE vào req
    let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload
    orgName = orgName.trim().replace(/ /g, "-")
    const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
    // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
    const newFullPath = `${fullPathInServ}-${orgName}`;
    fs.renameSync(fullPathInServ, newFullPath);

    md5File(newFullPath, (err, hashImage) => {
        if (err) throw err
        console.log("mã hash check: " + hashImage)
        // const accounts = web3.eth.getAccounts();
        imageContract.methods.getImage().call()
            .then(function(result){
                const arrayImage = result.map(a =>{
                    return Object.assign({}, a)
                })
                console.log(arrayImage);
                for (let index = 0; index < arrayImage.length; index++) {
                    const element = arrayImage[index];
                    if(element._hashImage === hashImage){
                        console.log(element._idUser)
                        userModel.find({_id: element._idUser}, (err, dataUser) => {
                            if(dataUser.length === 0){
                                console.log("Không tìm thấy user");
                                return
                            } else {
                                console.log(dataUser[0]);
                                imageModel.find({hashImage: hashImage}, (err, dataImage) =>{
                                    if (dataImage.length === 0) {
                                        console.log("Khong tim thay image");
                                        return
                                    } else {
                                        console.log(dataImage[0]);
                                        console.log("anh co txHash là: " + dataImage[0].transactionHash);
                                        res.send({
                                            status: true,
                                            message: "Ảnh của bạn là ảnh nguyên gốc",
                                            infoPhotographer:{
                                                email: dataUser[0].email,
                                                fullname: dataUser[0].fullname,
                                                transactionHash: dataImage[0].transactionHash,
                                                phone: dataUser[0].phone 
                                            }
                                        })
                                    }
                                })
                            } 
                        })
                        return
                    } else {
                        if (index === arrayImage.length - 1 && element._hashImage !== hashImage) {
                            res.send({
                                status: false,
                                message: "Ảnh của bạn không phải là ảnh nguyên gốc",
                            })   
                        }
                    }
                }
            }).catch(err =>{
                console.log(err)
            })
        // // Xóa file ảnh sau khi mã hóa md5
        fs.unlinkSync(newFullPath);
        console.log("đã xóa ảnh trong folder ImageCheck")
      })
})

ImageRouter.post('/personal', (req, res) =>{
    const idUser = req.body.idUser;
    userModel.find({_id: idUser}, (err, dataUser) => {
            imageModel.find({idUser: idUser}, (err, dataImage) => {
                if(dataImage.length === 0){
                    res.send({
                        status: true,
                        message: "Bạn chưa đăng bức ảnh nào",
                        data: {
                            dataUser: dataUser
                        }
                    })
                } else {
                    res.send({
                        status: true,
                        message: "Danh sách những bức ảnh bạn đã đăng",
                        data: {
                            dataUser: dataUser,
                            dataImage: dataImage
                        }
                    })
                }
            })
    })
})


module.exports = ImageRouter;