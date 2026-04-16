import React, { useContext } from 'react';
import Icon from '@ant-design/icons';
import { Draggable } from 'react-beautiful-dnd';
import { ReactComponent as DragSvg } from '../../assets/icons/drag.svg';
import { ReactComponent as DeleteSvg } from '../../assets/icons/delete.svg';
import { GlobalContext } from '../../Context';

const Drag = ({ id, index, hideDelete = false, disabled = false, ...props }: any) => {
  const { categories, setCategories }: any = useContext(GlobalContext);

  const handleDelete = (id: any) => {
    const isCategory = categories.some((category: any) => category.id === id);

    let updatedCategories;

    if (isCategory) {
      updatedCategories = categories.filter((category: any) => category.id !== id);
    } else {
      updatedCategories = categories.map((category: any) => {
        const updatedItems = category.items?.filter((item: any) => item.id !== id);

        return {
          ...category,
          items: updatedItems
        };
      });
    }

    setCategories(updatedCategories);
  };

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={disabled}>
      {(provided: any, snapshot: any) => {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps} {...props}>
            <div className='controls'>
              <button 
                className='drag-handle' 
                {...provided.dragHandleProps} 
                data-testid='drag-handle'
                disabled={disabled}
                style={{ 
                  cursor: disabled ? 'not-allowed' : 'grab', 
                  opacity: disabled ? 0.5 : 1,
                  pointerEvents: disabled ? 'none' : 'auto'
                }}
              >
                <Icon component={DragSvg} style={{ pointerEvents: disabled ? 'none' : 'auto' }} />
              </button>
              {!hideDelete && (
                <button 
                  className='delete' 
                  disabled={disabled}
                  onClick={() => !disabled && handleDelete(id)} 
                  data-testid='delete-button'
                  style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
                >
                  <Icon component={DeleteSvg} style={{ pointerEvents: disabled ? 'none' : 'auto' }} />
                </button>
              )}
            </div>
            {props?.children}
          </div>
        );
      }}
    </Draggable>
  );
};

export default Drag;
