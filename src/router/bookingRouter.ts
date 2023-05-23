import {Router} from 'express';
import bookingController from "../controller/bookingController";
import {auth} from "../middleware/auth";

const bookingRouter = Router()

bookingRouter.get('/', bookingController.all);
bookingRouter.get('/:id', bookingController.one);
bookingRouter.post('/', auth, bookingController.save);
bookingRouter.put('/:id', bookingController.update);
bookingRouter.delete('/:id', bookingController.delete);

export default bookingRouter