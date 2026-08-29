import { Router } from 'express';
import { schoolController } from './school.controller.js';
import { validateMiddleware } from '../../common/middleware/validation.middleware.js';
import { body } from 'express-validator';
import { SchoolRange, SchoolBoard, SchoolShift } from '../../common/constants.js';

const router = Router();

const createSchoolValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('legalName').trim().notEmpty().withMessage('Legal name is required'),
  body('domain').trim().notEmpty().withMessage('Domain is required').isString(),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail(),
  body('address').optional().isObject(),
  body('phone').optional().trim().isString(),
  body('logoUrl').optional().trim().isString(),
  body('timezone').optional().trim().isString(),
  body("establishedYear")
        .notEmpty()
        .withMessage("Established year is required")
        .isInt({
            min: 1800,
            max: new Date().getFullYear(),
        })
        .withMessage("Invalid established year"),

    body("schoolRange")
        .notEmpty()
        .withMessage("School range is required")
        .isString()
        .withMessage("School range must be a string")
        .isIn(Object.values(SchoolRange))
        .withMessage("Invalid school range"),

    body("shift")
        .notEmpty()
        .withMessage("Shift is required")
        .isString()
        .withMessage("Shift must be a string")
        .isIn(Object.values(SchoolShift))
        .withMessage("Invalid school shift"),

    body("numberOfCampus")
        .notEmpty()
        .withMessage("Number of campuses is required")
        .isInt({ min: 1 })
        .withMessage("Number of campuses must be at least 1"),

    body("selectedBoard")
        .notEmpty()
        .withMessage("Selected board is required")
        .isString()
        .withMessage("Selected board must be a string")
        .isIn(Object.values(SchoolBoard))
        .withMessage("Invalid school board"),
  body("admin")
        .notEmpty()
        .withMessage("Admin information is required")
        .isObject()
        .withMessage("Admin must be an object"),

    body("admin.firstName")
        .trim()
        .notEmpty()
        .withMessage("Admin first name is required")
        .isString()
        .withMessage("Admin first name must be a string"),

    body("admin.lastName")
        .trim()
        .notEmpty()
        .withMessage("Admin last name is required")
        .isString()
        .withMessage("Admin last name must be a string"),

    body("admin.email")
        .trim()
        .notEmpty()
        .withMessage("Admin email is required")
        .isEmail()
        .withMessage("Invalid admin email"),

    body("admin.password")
        .notEmpty()
        .withMessage("Admin password is required")
        .isString()
        .withMessage("Admin password must be a string")
        .isLength({ min: 8 })
        .withMessage("Admin password must be at least 8 characters long")
];

router.post('/', createSchoolValidation, validateMiddleware, schoolController.create);
router.get('/', schoolController.findAll);
router.get('/:id', schoolController.findOne);
router.get('/domain/:domain', schoolController.findOneByDomain);
router.patch('/:id', schoolController.update);
router.delete('/:id', schoolController.remove);

export default router;