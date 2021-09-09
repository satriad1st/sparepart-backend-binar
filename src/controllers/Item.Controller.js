const Item = require("../services/Item.Service")

class ItemController {

    async getItem(req, res) {
        const search = req.query.search ? req.query.search : ''

        let query = {} , total;
        try {
            query = {
                $or : [
                    {
                        name : { $regex : search , $options : "i" }
                    },
                    {
                        sparepartCode : { $regex : search , $options : "i" }
                    }
                ]
            }

            let data = await Item.getItem(query);

            total = data.length 

            res.status(200).json({
                code : 200,
                message : "Berhasil Mendapatkan Item",
                data,
                total
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                code : 500,
                messaage : "Server Sedang Sibuk"
            })
        }
    }

    async getItemDetail(req, res) {
        let query = {};
        try {
            query = {
                $or : [
                    {
                        _id : req.params.id
                    }
                ]
            }

            let data = await Item.getItemDetailByQuery(query);


            res.status(200).json({
                code : 200,
                message : "Berhasil Mendapatkan Detail Item",
                data,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                code : 500,
                messaage : "Server Sedang Sibuk"
            })
        }
    }


    async create(req , res){
        const { sparepartCode , name } = req.body

        if(!sparepartCode){
            return res.status(400).json({
                code : 400,
                message : "Sparepart Kode Dibutuhkan",
            })
        }

        if(!name){
            return res.status(400).json({
                code : 400,
                message : "Name Dibutuhkan",
            })
        }

        try {

            const checkSparepartCode = await Item.getItemDetailByQuery({sparepartCode});

            if(checkSparepartCode){
                return res.status(400).json({
                    code : 400,
                    message : "Sparepart Kode Sudah Terdaftar",
                })
            }

            const result = await Item.addItem(req.body);

            res.status(200).json({
                code : 200,
                message : "Berhasil Menambahkan Item",
                data : result
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                code : 500,
                messaage : "Server Sedang Sibuk"
            })
        }
    }

    async update(req , res){
        const { sparepartCode , name } = req.body

        if(!sparepartCode){
            return res.status(400).json({
                code : 400,
                message : "Sparepart Kode Dibutuhkan",
            })
        }

        if(!name){
            return res.status(400).json({
                code : 400,
                message : "Name Dibutuhkan",
            })
        }

        try {
            const currentData = await Item.getItemDetailByQuery({_id : req.params.id});

            if(!currentData){
                return res.status(400).json({
                    code : 400,
                    message : "Data Tidak Ditemukan Database",
                })
            }
            
            const checkSparepartCode = await Item.getItemDetailByQuery({$and :[
                {
                    sparepartCode : sparepartCode
                },
                {
                    sparepartCode : { $ne : currentData.sparepartCode }
                }
            ]});

            if(checkSparepartCode){
                return res.status(400).json({
                    code : 400,
                    message : "Sparepart Kode Sudah Terdaftar",
                })
            }

            const result = await Item.updateItem(req.body , req.params.id);

            res.status(200).json({
                code : 200,
                message : "Berhasil Mengupdate Item"
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                code : 500,
                messaage : "Server Sedang Sibuk"
            })
        }
    }

    async delete(req , res){
        try {
            const currentData = await Item.getItemDetailByQuery({_id : req.params.id});

            if(!currentData){
                return res.status(400).json({
                    code : 400,
                    message : "Data Tidak Ditemukan Database",
                })
            }
            const result = await Item.deleteItem(req.params.id);

            res.status(200).json({
                code : 200,
                message : "Berhasil Menghapus Item"
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                code : 500,
                messaage : "Server Sedang Sibuk"
            })
        }
    }
}

module.exports = new ItemController;