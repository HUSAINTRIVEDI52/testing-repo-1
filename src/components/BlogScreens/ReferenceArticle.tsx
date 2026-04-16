import React, { useContext, useEffect, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import Lottie from 'lottie-react';
import proBadgeAnimation from '../../assets/animations/pro-badge.json';
import Icon from '@ant-design/icons/lib/components/Icon';
import { ReactComponent as LinkIcon } from '../../assets/icons/link.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/plus.svg';
import { ReactComponent as FileIcon } from '../../assets/icons/file.svg';
import { ReactComponent as MinusIcon } from '../../assets/icons/minus.svg';
import { Form, Input, Upload, message, Button, Spin, Modal } from 'antd';
import { GlobalContext } from '../../Context';
import axios from 'axios';
import UpgradePlan from './Modal/upgradePlanModel';
import closeIcon from '../../assets/icons/fontisto_close.svg';
import { useNavigate } from 'react-router-dom';
import { planDetail } from '../../constant';
import { getUserFeatureAccess, FeatureAccessResponse } from '../../utils/getUserFeatureAccess';
import { addUniqueIds } from '../../utils/CommonFunction';

const ReferenceArticle = () => {
	const {
		step2Data,
		setStep2Data,
		setCurrentScreen,
		draftId,
		setVisited,
		visited,
		setSelectedBrandVoice,
		setStep4Data,
		setCategories,
		setSelectedModel,
		setSelectedBlogGuide,
		userModel,
		currentScreen,
		step4Data,
		planDetails,
		setPlanDetails,
		setStepLoader,
		step1Data,
		selectedLanguage,
		step3Data,
		categories,
		stepLoader,
		setDraftData,
	}: any = useContext(GlobalContext);
	const userId = localStorage.getItem('userId');
	const [baseurl, setBaseurl] = useState<string>('');
	const [urlLoading, setUrlLoading] = useState<boolean>(false);
	const [nextLoading, setNextLoading] = useState<boolean>(false);
	const [skipLoading, setSkipLoading] = useState<boolean>(false);
	// const [planDetails, setPlanDetails] = useState<any>([]);
	// const [maxCount, setMaxCount] = useState<any>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [change, setChange] = useState(false);
	const [errMsg, setErrMsg] = useState('');
	const [deleteFile, setDeleteFile] = useState<string[]>([]);
	const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
	const [pendingFormData, setPendingFormData] = useState<FormData | null>(
		null
	);

	const navigate = useNavigate();
	const [featureAccess, setFeatureAccess] = useState<FeatureAccessResponse | null>(null);
	const [isFeatureAccessLoading, setIsFeatureAccessLoading] = useState(true);

	const getPlanDetails = () => {
		axios
			.get(`${process.env.REACT_APP_SERVER_URL}/plan-details?userId=${userId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`
				}
			})
			.then((res) => {
				setPlanDetails(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getPlanDetails();
	}, []);

	// Fetch feature access on component mount
	useEffect(() => {
		const fetchFeatureAccess = async () => {
			setIsFeatureAccessLoading(true);
			const access = await getUserFeatureAccess();
			setFeatureAccess(access);
			setIsFeatureAccessLoading(false);
		};
		fetchFeatureAccess();
	}, []);

	// Determine if reference data is locked for the user
	const isReferenceLocked = featureAccess?.fileLimit === 0 && featureAccess?.linkLimit === 0;

    // Helper to safely get max count if not provided by backend
    const getSafeMaxCount = () => {
        if (planDetails?.maxCount) return planDetails.maxCount;
        if (!planDetails?.name) return 0;
        switch (planDetails.name) {
            case 'Free': return 2;
            case 'Basic': return 4;
            case 'Pro': return 10;
            case 'Agency': return 10;
            default: return 10;
        }
    };

    const safeMaxCount = getSafeMaxCount();

	const beforeUpload = (file: any, fileList: any[]) => {
		const allowedFileTypes = [
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/msword',
		];

		let errorMessage: string | null = null;

		// Check for file type error
		const hasInvalidFileType = fileList.some(
			(f: any) => !allowedFileTypes.includes(f.type)
		);
		if (hasInvalidFileType && !errorMessage) {
			errorMessage = 'Please upload a .docx or .pdf file';
		}

		// Check if the file count exceeds max count
		const totalFiles = step2Data.files.length + fileList.length;
		if (totalFiles > safeMaxCount && !errorMessage) {
			errorMessage = `You can only upload up to ${safeMaxCount} files`;
		}

		// Check for duplicate file error
		const hasDuplicateFile = fileList.some((f: any) =>
			step2Data.files.some(
				(uploadedFile: any) =>
					uploadedFile.name === f.name &&
					uploadedFile.size === f.size
			)
		);
		if (hasDuplicateFile && !errorMessage) {
			errorMessage = 'This file has already been uploaded';
		}

		// Check for file size error
		const hasInvalidSize = fileList.some(
			(f: any) => f.size / 1024 / 1024 >= 10
		);
		if (hasInvalidSize && !errorMessage) {
			errorMessage = 'File size should be less than 10MB';
		}

		// If there's any error, show the message and stop upload
		if (errorMessage) {
			setErrMsg(errorMessage);
			return false;
		}

		// If all checks pass, allow upload
		return true;
	};

	useEffect(() => {
		if (errMsg !== '') {
			message.error(errMsg);
		}
	}, [errMsg]);

	const uploadProps = {
		maxCount:
			planDetails.name === 'Free'
				? 2
				: planDetails.name === 'Basic'
					? 4
					: 10,
		beforeUpload,
		accept: '.pdf,.docx,.doc',
                disabled: planDetails.name === 'Free'
	};
	const handleUpload = async (file: any) => {
		const applyUpload = (file: any) => {
			setStep2Data((prevStep2Data: any) => ({
				...prevStep2Data,
				files: [...prevStep2Data.files, file],
			}));
			setChange(true);
		};

		if (visited > 4) {
			Modal.confirm({
				title: 'Confirmation Required',
				content: 'As you are changing the reference data, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
				okText: 'Yes, Continue',
				cancelText: 'Cancel',
				okButtonProps: { danger: true },
				onOk: () => {
					setVisited(1);
					applyUpload(file);
				}
			});
			return;
		}

		try {
			// Update step2Data state
			applyUpload(file);
			if (visited < currentScreen) setVisited(currentScreen);
		} catch (error: any) {
			if (error?.response?.status === 403) {
				setIsModalOpen(true);
				message.error(error?.response?.data?.error || 'File upload not available on your plan');
			} else {
				message.error('Failed to upload file. Please try again.');
			}
		}
	};
	const handleRemoveFile = (index: number) => {
		const applyRemove = () => {
			setStep2Data((prevStep2Data: any) => {
				const newFiles = [...prevStep2Data.files];
				newFiles.splice(index, 1);
				return { ...prevStep2Data, files: newFiles };
			});
		};

		if (visited > 4) {
			Modal.confirm({
				title: 'Confirmation Required',
				content: 'As you are changing the reference data, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
				okText: 'Yes, Continue',
				cancelText: 'Cancel',
				okButtonProps: { danger: true },
				onOk: () => {
					setVisited(1);
					applyRemove();
				}
			});
			return;
		}

		applyRemove();
		if (visited < currentScreen) setVisited(currentScreen);
	};

	//This code is for handling adding URL locally (no scraping here)
	const handleScraping = async () => {
		setUrlLoading(true);
		setStepLoader(true);

		if (!isValidBaseUrl(baseurl)) {
			message.error('Please enter a valid URL');
			setUrlLoading(false);
			setStepLoader(false);
			return;
		}

		if (hasReachedUrlLimit(step2Data.scrappedUrl)) {
			message.error('You can only add up to 10 URLs');
			setBaseurl('');
			setUrlLoading(false);
			setStepLoader(false);
			return;
		}

		if (isDuplicateUrl(step2Data.scrappedUrl, baseurl)) {
			message.error('This URL has already been added');
			setBaseurl('');
			setUrlLoading(false);
			setStepLoader(false);
			return;
		}

		const applyScraping = () => {
			// Add to local state only
			updateStep2Data(baseurl);
			setChange(true);
			setBaseurl('');
		};

		if (visited > 4) {
			Modal.confirm({
				title: 'Confirmation Required',
				content: 'As you are changing the reference data, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
				okText: 'Yes, Continue',
				cancelText: 'Cancel',
				okButtonProps: { danger: true },
				onOk: () => {
					setVisited(1);
					applyScraping();
				},
				onCancel: () => {
					setUrlLoading(false);
					setStepLoader(false);
				}
			});
			setUrlLoading(false);
			setStepLoader(false);
			return;
		}

		applyScraping();
		if (visited < currentScreen) setVisited(currentScreen);
		setUrlLoading(false);
		setStepLoader(false);
	};
	const isValidBaseUrl = (baseurl: string) => {
		try {
			new URL(baseurl);
			return baseurl.trim() !== '';
		} catch (e) {
			return false;
		}
	};
	const hasReachedUrlLimit = (scrappedUrl: any[]) => {
		return scrappedUrl.length >= 10;
	};
	const isDuplicateUrl = (scrappedUrl: any[], baseurl: string) => {
		return scrappedUrl.some((url: any) => url.baseurl === baseurl);
	};

	// Removed server-side crawling here; URLs are collected locally and sent on finish
	const updateStep2Data = (newUrl: string) => {
		setStep2Data((prevStep2Data: any) => {
			if (newUrl && newUrl.trim() !== '') {
				return {
					...prevStep2Data,
					scrappedUrl: [
						...prevStep2Data.scrappedUrl,
						{ baseurl: newUrl },
					],
				};
			}
			return prevStep2Data;
		});
	};

	const getErrorMessage = (error: any) => {
		return error?.response?.data?.error
			? error?.response?.data?.error
			: error?.message;
	};

	const deleteSingleScrappedUrl = async (index: any) => {
		const applyDelete = () => {
			// Local removal only
			setStep2Data((prevStep2Data: any) => ({
				...prevStep2Data,
				scrappedUrl: prevStep2Data.scrappedUrl.filter(
					(url: any, idx: any) => idx !== index
				),
			}));
		};

		if (visited > 4) {
			Modal.confirm({
				title: 'Confirmation Required',
				content: 'As you are changing the reference data, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
				okText: 'Yes, Continue',
				cancelText: 'Cancel',
				okButtonProps: { danger: true },
				onOk: () => {
					setVisited(1);
					applyDelete();
				}
			});
			return;
		}

		applyDelete();
		if (visited < currentScreen) setVisited(currentScreen);
	};
	const delay = (ms: any) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const handleConfirmedSubmission = async () => {
		if (!pendingFormData) return;

		setConfirmationModalOpen(false);
		setNextLoading(true);
		setStepLoader(true);

		try {
			const fileDetails = step2Data.files.map((file: any) => ({
				uid: file.uid,
				name: file.name,
				size: file.size,
				type: file.type,
			}));

			const value = {
				id: draftId,
				userId: localStorage.getItem('userId'),
				referenceLinkCount: `${step2Data.scrappedUrl.length} URLs, ${step2Data.files.length} files`,
				data: {
					scrappedUrl: step2Data.scrappedUrl,
					files: fileDetails,
				},
				visited: 3,
			};
			await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/save-draft?userId=${userId}`,
				value,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'accessToken'
						)}`,
					},
				}
			);
			if (visited < 3) {
				setVisited(3);
			}
			setCurrentScreen(3);
			message.success('Reference data saved successfully!');
		} catch (error: any) {
			if (error?.response?.status === 403) {
				setIsModalOpen(true);
				message.error(
					error?.response?.data?.error || 'Reference data feature not available on your plan. Please upgrade.'
				);
			} else {
				message.error(
					error?.response?.data?.error
						? error?.response?.data?.error
						: error?.message
				);
			}
		} finally {
			setNextLoading(false);
			setStepLoader(false);
			setPendingFormData(null);
		}
	};

	const proceedWithoutReferences = async () => {
		setSkipLoading(true);
		setStepLoader(true);
		if (visited > 2 && !change) {
			setStepLoader(false);
			setCurrentScreen(3);
			return;
		}

		const token = localStorage.getItem('accessToken');
		if (!token) {
			// Guest Mode: Just advance
			if (visited < 3) {
				setVisited(3);
			}
			setCurrentScreen(3);
			setSkipLoading(false);
			setStepLoader(false);
			return;
		}

		try {
			const value = {
				id: draftId,
				userId: localStorage.getItem('userId'),
				referenceLinkCount: '',
				data: undefined,
				visited: 3,
			};
			await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/save-draft?userId=${userId}`,
				value,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'accessToken'
						)}`,
					},
				}
			);
			if (visited < 3) {
				setVisited(3);
			}
			setCurrentScreen(3);
		} catch (error: any) {
			message.error(
				error?.response?.data?.error
					? error?.response?.data?.error
					: error?.message
			);
		} finally {
			setSkipLoading(false);
			setStepLoader(false);
		}
	};

	const onFinish = async (values: any) => {
		const { scrappedUrl, files } = step2Data;

		// If user has already visited step 2 or above and hasn't made changes, skip processing
		if (visited > 2 && !change) {
			setCurrentScreen(3);
			return;
		}

		setNextLoading(true);
		setStepLoader(true);

		const token = localStorage.getItem('accessToken');
		if (!token) {
			// Guest Mode: Just advance
			if (visited < 3) {
				setVisited(3);
			}
			setCurrentScreen(3);
			setNextLoading(false);
			setStepLoader(false);
			return;
		}

		try {
			const fileDetails = step2Data.files.map((file: any) => ({
				uid: file.uid,
				name: file.name,
				size: file.size,
				type: file.type,
			}));

			const value = {
				id: draftId,
				userId: localStorage.getItem('userId'),
				referenceLinkCount: `${step2Data.scrappedUrl.length} URLs, ${step2Data.files.length} files`,
				data: {
					scrappedUrl: step2Data.scrappedUrl,
					files: fileDetails,
				},
				visited: 3,
			};
			await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/save-draft?userId=${userId}`,
				value,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'accessToken'
						)}`,
					},
				}
			);
			if (visited < 3) {
				setVisited(3);
			}
			setCurrentScreen(3);
		} catch (error: any) {
			// Check for 403 Forbidden (feature access denied)
			if (error?.response?.status === 403) {
				setIsModalOpen(true);
				message.error(
					error?.response?.data?.error || 'Reference data feature not available on your plan. Please upgrade.'
				);
			} else {
				message.error(
					error?.response?.data?.error
						? error?.response?.data?.error
						: error?.message
				);
			}
		}

		setNextLoading(false);
		setStepLoader(false);
	};

	return (
		<div className='title-container'>
			<h1 className='title'>Create Your Own Blog Knowledge Base</h1>
			<p>
				Upload your documents and URLs to create a personalized knowledge base. <strong style={{ fontWeight: 'bold', color: '#262626' }}>No internet knowledge will be used</strong>—we rely exclusively on what you provide.
			</p>
			{safeMaxCount > 0 && (
				<Form
					onFinish={onFinish}
					layout={'vertical'}
					className='reference-form'
					fields={[
						{
							name: ['baseurl'],
							value: baseurl,
						},
					]}
				>
					<div
						className={`reference-form-item ${planDetails.name === 'Free' || planDetails.name === 'Basic'
							? 'blur'
							: ''
							}`}
					>
						<Form.Item
							name='baseurl'
							label={
								<div className='cus-label'>
									<Icon
										component={LinkIcon}
									/>{' '}
									Reference External URLs
								</div>
							}
							tooltip={{
								title:
									planDetails.name === 'Free' || planDetails.name === 'Basic'
										? 'Upgrade to Pro or Agency plan to provide reference data through link'
										: '(upto 10 links)',
								icon: (
									<InfoCircleOutlined
										style={{
											cursor: 'pointer',
										}}
									/>
								),
							}}
						>
							<Input
								disabled={
									nextLoading ||
									skipLoading ||
									urlLoading ||
									stepLoader ||
									!planDetails ||
									planDetails.name === 'Free' ||
									planDetails.name === 'Basic'
								}
								placeholder='Add links here'
								onChange={(e) => {
									setBaseurl(
										e.target.value
									);
								}}
								onPressEnter={(e) => {
									if (nextLoading) {
										e.preventDefault();
										return;
									}

									e.preventDefault();
									handleScraping();
								}}
								suffix={
									urlLoading ? (
										<Spin size='small' />
									) : !planDetails ||
										planDetails.name === 'Free' ||
										planDetails.name === 'Basic' ? (
										<></>
									) : (
										<Icon
											component={
												PlusIcon
											}
											data-testid='plus'
											onClick={
												!nextLoading &&
													!skipLoading
													? handleScraping
													: undefined
											}
											style={{
												pointerEvents:
													nextLoading ||
														skipLoading ||
														urlLoading ||
														stepLoader
														? 'none'
														: 'auto',
												opacity:
													nextLoading ||
														skipLoading ||
														urlLoading ||
														stepLoader ||
														planDetails.name === 'Free' ||
														planDetails.name === 'Basic'
														? 0.5
														: 1,
											}}
										/>
									)
								}
							/>
						</Form.Item>
						<div className='data-list link-list'>
							{step2Data?.scrappedUrl?.map(
								(item: any, index: any) => (
									<div
										className='list'
										key={item?.baseurl}
									>
										<span className='text'>
											{
												item?.baseurl
											}
										</span>
										<span className='icon'>
											<Icon
												component={
													MinusIcon
												}
												disabled={
													nextLoading ||
													skipLoading ||
													urlLoading ||
													stepLoader
												}
												onClick={() => {
													if (
														nextLoading ||
														skipLoading ||
														urlLoading ||
														stepLoader
													)
														return;

													if (visited > 4) {
														Modal.confirm({
															title: 'Confirmation',
															content: 'Changing this will reset some data. Do you want to continue?',
															onOk() {
																setStep4Data(
																	{
																		links: [],
																	}
																);
																setSelectedBrandVoice(
																	[]
																);
																setSelectedBlogGuide(
																	[]
																);
																setSelectedModel(
																	userModel
																);
																setCategories(
																	[]
																);
																setDraftData((prev: any) => ({
																	...prev,
																	outlineRegeneratedCount: 0,
																	outlineLastInputs: null
																}));
																setVisited(1); // Reset visited
																deleteSingleScrappedUrl(
																	index
																);
															},
															onCancel() {
																// Do nothing
															},
														});
													} else {
														setStep4Data(
															{
																links: [],
															}
														);
														setSelectedBrandVoice(
															[]
														);
														setSelectedBlogGuide(
															[]
														);
														setSelectedModel(
															userModel
														);
														setCategories(
															[]
														);
														setDraftData((prev: any) => ({
															...prev,
															outlineRegeneratedCount: 0,
															outlineLastInputs: null
														}));
														if (visited < currentScreen) {
															setVisited(currentScreen);
														}
														deleteSingleScrappedUrl(
															index
														);
													}
												}}
											/>
										</span>
									</div>
								)
							)}
						</div>
					</div>
					<div className={`reference-form-item ${
						planDetails.name === 'Free' || featureAccess?.fileLimit === 0 ? 'blur' : ''
					}`}>
						<Form.Item
							label={
								<div className='cus-label'>
									<Icon
										component={FileIcon}
									/>{' '}
									Reference Files
								</div>
							}
							tooltip={{
								title: planDetails.name === 'Free' || featureAccess?.fileLimit === 0
									? 'Upgrade your plan to upload reference files'
									: `(upto ${safeMaxCount} files, max 10 MB per file)`,
								icon: (
									<InfoCircleOutlined
										style={{
											cursor: 'pointer',
										}}
									/>
								),
							}}
						>
							<Upload
								multiple={true}
								{...uploadProps}
								disabled={nextLoading || skipLoading || urlLoading || stepLoader || planDetails.name === 'Free'}
								customRequest={({
									file,
									onSuccess,
									onError,
								}: any) => {
									if (nextLoading || skipLoading) return;
									handleUpload(file)
										.then(() =>
											onSuccess()
										)
										.catch((err) => {
											onError(err);
										});
								}}
								fileList={[]}
								onChange={() => setErrMsg('')}
							>
								<Button
									icon={
										<Icon
											component={
												PlusIcon
											}
										/>
									}
									disabled={planDetails.name === 'Free' || featureAccess?.fileLimit === 0 || nextLoading || skipLoading || urlLoading || stepLoader}
								>
									Upload Files from computer
								</Button>
							</Upload>
						</Form.Item>
						<div className='data-list upload-list'>
							{step2Data?.files.map(
								(item: any, index: any) => (
									<div
										className='list'
										key={item?.name}
									>
										<span className='title'>
											{item?.name}
										</span>
										<span className='icon'>
											<Icon
												component={
													MinusIcon
												}
												onClick={() => {
													if (
														nextLoading ||
														skipLoading ||
														urlLoading ||
														stepLoader
													)
														return;
													handleRemoveFile(
														index
													);
												}}
												disabled={
													nextLoading ||
													skipLoading
												}
											/>
										</span>
									</div>
								)
							)}
						</div>
					</div>
					<div className='btn-wrapper'>
						<Form.Item className='skip-btn'>
							<Button
								type='default'
								onClick={proceedWithoutReferences}
								disabled={
									nextLoading ||
									urlLoading ||
									stepLoader ||
									step2Data.scrappedUrl.length > 0 ||
									step2Data.files.length > 0
								}
								loading={skipLoading}
							>
								Skip
							</Button>
						</Form.Item>
						<Form.Item className='next-btn'>
							<Button
								loading={nextLoading}
								disabled={
									(step2Data.scrappedUrl.length ===
										0 &&
										step2Data.files.length === 0) ||
									skipLoading ||
									urlLoading ||
									stepLoader
								}
								type='primary'
								htmlType='submit'
							>
								Next
							</Button>
						</Form.Item>
					</div>
				</Form>
			)}
			<Modal
				centered
				className='keyword-model'
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={null}
				closeIcon={
					<img
						src={closeIcon}
						alt='closeIcon'
						onClick={() => setIsModalOpen(false)}
						className='img-cancle'
					/>
				}
			>
				<UpgradePlan setIsModalOpen={setIsModalOpen} />
			</Modal>
			<Modal
				centered
				className='confirmation-modal'
				open={confirmationModalOpen}
				onCancel={() => {
					setConfirmationModalOpen(false);
					setPendingFormData(null);
				}}
				footer={[
					<Button
						key='no'
						onClick={() => {
							setConfirmationModalOpen(false);
							setPendingFormData(null);
							message.info('Operation cancelled');
						}}
					>
						No
					</Button>,
					<Button
						key='yes'
						type='primary'
						onClick={handleConfirmedSubmission}
						loading={nextLoading}
					>
						Yes
					</Button>,
				]}
				closeIcon={
					<img
						src={closeIcon}
						alt='closeIcon'
						onClick={() => {
							setConfirmationModalOpen(false);
							setPendingFormData(null);
						}}
						className='img-cancle'
					/>
				}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						marginBottom: 8,
					}}
				>
					<InfoCircleOutlined
						style={{ color: '#faad14', fontSize: 22 }}
					/>
					<h2 style={{ margin: 0 }}>
						Insufficient Reference Data
					</h2>
				</div>
				<p>
					Reference data is not sufficient to generate the
					blog outline. Would you like to proceed further
					with generating the blog outline?
				</p>
			</Modal>
		</div>
	);
};

export default ReferenceArticle;
