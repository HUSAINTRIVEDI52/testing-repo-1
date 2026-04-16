import axios from 'axios';

export interface FeatureAccessResponse {
    canUseReferenceData: boolean;
    fileLimit: number;
    linkLimit: number;
    planName: string;
    planId: string;
}

export const getUserFeatureAccess = async (): Promise<FeatureAccessResponse | null> => {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('accessToken');

        if (!userId || userId === 'null' || !token || token === 'null' || token === 'undefined') {
            console.log('Skipping feature access fetch: User is guest or unauthenticated');
            return null;
        }

        const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/user/feature-access`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error('Error fetching user feature access:', error);
        return null;
    }
};
