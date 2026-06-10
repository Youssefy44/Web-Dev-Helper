import { Router, type IRouter } from "express";
import healthRouter from "./health";
import searchRouter from "./search";
import notesRouter from "./notes";
import assistantRouter from "./assistant";

const router: IRouter = Router();

router.use(healthRouter);
router.use(searchRouter);
router.use(notesRouter);
router.use(assistantRouter);

export default router;
