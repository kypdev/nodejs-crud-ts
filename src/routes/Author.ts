import express from 'express'
import { Schema } from 'mongoose'
import controller from '../controllers/Author'
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema'

const router = express.Router()

router.post('/', ValidateSchema(Schemas.author.create), controller.createAuthor)
router.get('/:authorId', controller.readAuthor)
router.get('/', controller.readAllAuthor)
router.patch('/:authorId', ValidateSchema(Schemas.author.update), controller.updateAuthor)
router.delete('/:authorId', controller.deleteAuthor)

export = router