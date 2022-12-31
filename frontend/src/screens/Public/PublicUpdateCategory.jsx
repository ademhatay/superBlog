import { PlusCircleIcon, BookOpenIcon } from "@heroicons/react/solid";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleCategoryAction, updateCategoryAction, deleteCategoryAction } from "../../app/slices/category/categorySlice";
import { Container } from '../../components';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../utils/isAdmin";

//Form schema
const formSchema = Yup.object({
	title: Yup.string().required("Title is required"),
});

const PublicUpdateCategory = () => {

	const [isAdmin, setIsAdmin] = useState(false);
	const dispatch = useDispatch();

	const navigate = useNavigate();
	const { userAuth } = useSelector(state => state?.users);

	useEffect(() => {
		getUser(userAuth).then((res) => {
			if (res) {
				setIsAdmin(true)
			} else {
				setIsAdmin(false);
				navigate('/dashboard');
			}
		})
	}, [userAuth]);

	const { id } = useParams();


	//fetch category
	useEffect(() => {
		dispatch(fetchSingleCategoryAction(id));
	}, [dispatch, id]);

	//get data from store
	const state = useSelector(state => state?.category);

	const { loading, appErr, serverErr, singleCategory } = state;

	//formik
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			title: singleCategory?.title || "",
		},
		onSubmit: values => {
			//dispath the action
			dispatch(updateCategoryAction({ title: values.title, id }));
			dispatch(fetchSingleCategoryAction(id));
			navigate("/live-categories")
			//reset form
			formik.resetForm();
		},
		validationSchema: formSchema,
	});


	const deleteCategory = () => {
		dispatch(deleteCategoryAction(id));
		navigate("/live-categories")
	}

	return (
		isAdmin&& <Container>
			<div className=" h-full flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					<div>
						<BookOpenIcon className="mx-auto h-12 w-auto" />
						<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
							Update Category
						</h2>
						<div className="mt-2 text-center text-sm text-gray-600">
							<p className="font-medium text-indigo-600 hover:text-indigo-500">
								These are the categories user will select when creating a post
							</p>
							{/* Display err */}
							<div>
								{appErr || serverErr ? (
									<h2 className="text-red-500 text-center text-lg">
										{serverErr} {appErr}
									</h2>
								) : null}
							</div>
						</div>
					</div>
					{/* Form */}
					<form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
						<input type="hidden" name="remember" defaultValue="true" />
						<div className="rounded-md shadow-sm -space-y-px">
							<div>
								<label htmlFor="email-address" className="sr-only">
									Name
								</label>
								{/* Title */}
								<input
									value={formik.values.title}
									onChange={formik.handleChange("title")}
									onBlur={formik.handleBlur("title")}
									type="text"
									autoComplete="text"
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center focus:z-10 sm:text-sm"
									placeholder="New Category"
								/>
								<div className="text-red-400 mb-2">
									{formik.touched.title && formik.errors.title}
								</div>
							</div>
						</div>

						<div>
							<div>
								{/* Submit */}
								{loading ? (
									<button
										disabled
										className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 "
									>
										<div className="absolute left-0 inset-y-0 flex items-center pl-3">
											<PlusCircleIcon
												className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
												aria-hidden="true"
											/>
										</div>
										Loading please wait...
									</button>
								) : (
									<button
										type="submit"
										className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										<span className="absolute left-0 inset-y-0 flex items-center pl-3">
											<PlusCircleIcon
												className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
												aria-hidden="true"
											/>
										</span>
										Update Category
									</button>
								)}
							</div>
							<button
								onClick={deleteCategory}
								className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5"
							>
								<span className="absolute left-0 inset-y-0 flex items-center pl-3">
									<PlusCircleIcon
										className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
										aria-hidden="true"
									/>
								</span>
								Delete Category
							</button>
						</div>
					</form>
				</div>
			</div>
		</Container>
	);
};

export default PublicUpdateCategory;
