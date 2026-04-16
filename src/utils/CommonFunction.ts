import { message } from 'antd';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Create a new function to handle the common logic
export const handleKeywordHandler = async (values: any, setKeywordExplorerLoader: any, setKeywordData: any, setIsModalOpen: any, type?: string, onTrialExhausted?: () => void) => {
  try {
    const payload = { ...values, type };
    const result: any = await axios.post(`${process.env.REACT_APP_SERVER_URL}/getKeywords`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (result.status === 200) {
      const formattedData = result?.data?.candidates?.map((item: any, index: number) => ({
        key: index,
        Keywords: item.text,
        Volume: item.volume,
        Difficulty: item.difficulty
      })) || [];

      setKeywordData(formattedData);
      setIsModalOpen(true);
      return true;
    }
    return false;
  } catch (error: any) {
    if (error?.response?.data?.code === 'GUEST_LIMIT_REACHED' && onTrialExhausted) {
      onTrialExhausted();
    }
    message.error(error?.response?.data?.error ? error?.response?.data?.error : error?.message);
    return false;
  }
};

// Recursive function to force unique IDs and deep clone
export const addUniqueIds = (items: any[]): any[] => {
  if (!items) return [];
  return items.map((item) => ({
    ...item,
    id: uuidv4(), // Always generate a new unique ID
    items: item.items ? addUniqueIds(item.items) : []
  }));
};
