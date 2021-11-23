import cloudinary from "../utils/cloudinary.js";
import Platform from '../models/Platform.js'

export const uploadImgToCloud = async (img) =>{
    try {
        const res = await cloudinary.uploader.upload(img, {
            upload_preset: 'dev_setups',
        });
        return res
    } catch (err) {
        console.error(err);
    }
}

export const queryBuilder = (queries, model) => {
    var query = {}
    var operations = []

    for (var key in queries) {
        if (key === 'expand') {
            var r = /,\s*(?![^()]*\))/gm
            var regex = /^([^()]+)(\(([^)]+)=([^)]+)\))?$/
            const populates = queries[key].split(r)
            for (var p in populates) {
                const m = regex.exec(populates[p])
                operations.push({
                    operation: 'populate',
                    path: m[1],
                    path_select: m[4] ? m[4].replace(/,/g, ' ') : null
                })
            }
        } else if (key === 'select') {
            operations.push({
                operation: 'select',
                fields: queries[key].replace(/,/g, ' ')
            })
        } else if (key === 'sort') {
            var sort = {}
            const sortFields = queries[key].split(',')
            for (var v in sortFields) {
                const [sortBy, orderBy] = sortFields[v].split(' ')
                if (orderBy) {
                    sort[sortBy] = orderBy === 'asc' ? 1 : -1
                } else {
                    sort[sortBy] = 1
                }
            }
            operations.push({
                operation: 'sort',
                sort: sort
            })
        } else if (key === 'limit' || key === 'offset') {
            break
        } else if (key === 'name') {
            query[key] = {
                "$regex": queries[key], 
                "$options": "i"
            }
        } else {
            query[key] = queries[key]
        }
    }
    
    var q = model.find(query)
    for (var o in operations) {
        const op = operations[o]
        if (op.operation === 'populate') {
            q = q.populate(op.path, op.path_select)
        } else if (op.operation === 'select') {
            q = q.select(op.fields)
        } else if (op.operation === 'sort') {
            q = q.sort(op.sort)
        }     
    }
    return q
}

export const paginateQuery = async (q, model, limit, offset) => {
    const pageSize = parseInt(limit) || 10
    const page = parseInt(offset) || 0
    const totalCount = await model.countDocuments(q)
    console.log(totalCount)
    const pages = Math.ceil(totalCount / pageSize)
    console.log(pages)
    q = q.limit(pageSize).skip(page * pageSize)

    return { q, page, pages, totalCount }
}