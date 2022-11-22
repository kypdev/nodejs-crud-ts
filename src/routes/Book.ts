import express from 'express'
import controller from '../controllers/Book'
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema'

const router = express.Router()

router.post('/', ValidateSchema(Schemas.book.create), controller.createBook)
router.get('/:bookId', controller.readBook)
router.get('/', controller.readAllBook)
router.patch('/:bookId', ValidateSchema(Schemas.book.update), controller.updateBook)
router.delete('/:bookId', controller.deleteBook)

export = router