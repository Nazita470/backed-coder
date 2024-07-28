import multer from "multer"
import { __dirname } from "../../utils.js"

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(file.fieldname == "profile") {
            cb(null, __dirname+"/utils/multer/img/profiles")
        }
        else if (file.fieldname == "products") {
            cb(null, __dirname+"/utils/multer/img/products")
        }
        else {
            cb(null, __dirname+"/utils/multer/img/documents")
        }
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

export const uploader = multer({storage})