import React, { useContext, useState, useEffect } from 'react';
import { DragDropContext as DragAndDrop } from 'react-beautiful-dnd';
import Drop from '../drag-drop/Drop';
import Drag from '../drag-drop/Drag';
import { Form, Input, Spin, Button, message } from 'antd';
import { GlobalContext } from '../../Context';
import { v4 as uuidv4 } from 'uuid';
import { EditOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ReactComponent as DeleteSvg } from '../../assets/icons/delete.svg';
import Icon from '@ant-design/icons';

export const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result?.splice(endIndex, 0, removed);

  return result;
};

const NestedDragDropEle = ({ loader, isGenerating }: any) => {
  const [categoryId, setCategoryId] = useState<string | null | undefined>(undefined);
  const [mainCategoryInput, setMainCategoryInput] = useState('');
  const [childCategoryInput, setChildCategoryInput] = useState('');
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const { categories, setCategories, stepLoader }: any = useContext(GlobalContext);

  useEffect(() => {
    if (categories?.length > 0 && categoryId === undefined) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  // Reset categoryId to undefined when categories are cleared (regeneration)
  // this ensures the auto-expansion effect runs again for the new outline
  useEffect(() => {
    if (categories?.length === 0) {
      setCategoryId(undefined);
    }
  }, [categories]);

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = (id: string, isH2: boolean, parentId: string | null = null) => {
    if (!editValue.trim()) {
      message.error("Title cannot be empty");
      return;
    }

    if (isH2) {
      // Update H2
      const updatedCategories = categories.map((cat: any) => 
        cat.id === id ? { ...cat, name: editValue.trim() } : cat
      );
      setCategories(updatedCategories);
    } else {
      // Update H3
      const updatedCategories = categories.map((cat: any) => {
        if (cat.id === parentId) {
          const updatedItems = cat.items.map((item: any) => 
            item.id === id ? { ...item, name: editValue.trim() } : item
          );
          return { ...cat, items: updatedItems };
        }
        return cat;
      });
      setCategories(updatedCategories);
    }
    setEditingId(null);
    setEditValue('');
  };


  const handleDragEnd = (result: any) => {
    const { type, source, destination } = result;
    if (!destination) return;

    const getSourceCategory = () => categories?.find((category: any) => category?.id === source?.droppableId);
    const getDestinationCategory = () => categories?.find((category: any) => category?.id === destination?.droppableId);

    const handleItemDrag = () => {
      const sourceCategory = getSourceCategory();
      const destinationCategory = getDestinationCategory();

      if (!sourceCategory || !destinationCategory) return;

      if (sourceCategory.id === destinationCategory.id) {
        reorderItems(sourceCategory, source?.index, destination?.index);
      } else {
        moveItemBetweenCategories(sourceCategory, destinationCategory, source?.index, destination?.index);
      }
    };

    const handleCategoryDrag = () => {
      const updatedCategories = reorder(categories, source?.index, destination?.index);
      setCategories(updatedCategories);
    };

    if (type === 'droppable-item') {
      handleItemDrag();
    } else if (type === 'droppable-category') {
      handleCategoryDrag();
    }
  };

  const reorderItems = (category: any, sourceIndex: number, destinationIndex: number) => {
    const updatedOrder = reorder(category.items, sourceIndex, destinationIndex);
    setCategories(categories?.map((cat: any) => (cat.id === category.id ? { ...cat, items: updatedOrder } : cat)));
  };

  const moveItemBetweenCategories = (
    sourceCategory: any,
    destinationCategory: any,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    // Create immutable copies
    const sourceItems = Array.from(sourceCategory.items);
    const destItems = sourceCategory.id === destinationCategory.id 
      ? sourceItems 
      : Array.from(destinationCategory.items);
    
    const [removed] = sourceItems.splice(sourceIndex, 1);
    destItems.splice(destinationIndex, 0, removed);

    setCategories(
      categories?.map((cat: any) => {
        if (cat.id === sourceCategory.id) {
          return { ...cat, items: sourceCategory.id === destinationCategory.id ? destItems : sourceItems };
        }
        if (cat.id === destinationCategory.id) {
          return { ...cat, items: destItems };
        }
        return cat;
      })
    );
  };

  const handleCategoryTitle = (e: any, category: any, id: any = null) => {
    if (category === 'mainCategory') {
      if (e.target.value.trim()) {
        setMainCategoryInput(e.target.value);
      } else {
        setMainCategoryInput(e.target.value.trim());
      }
    } else if (category === 'childCategory') {
      if (e.target.value.trim()) {
        setChildCategoryInput(e.target.value);
      } else {
        setChildCategoryInput(e.target.value.trim());
      }
    }

    if (e.target.value.trim().length > 0) {
      if (e?.key === 'Enter') {
        if (category === 'mainCategory') {
          setCategories([...categories, { id: uuidv4(), name: e.target.value.trim(), items: [] }]);
          setMainCategoryInput('');
        } else if (category === 'childCategory') {
          const updatedCategories = categories?.map((catItem: any) => {
            if (catItem?.id === id) {
              let updatedItem = [...catItem.items, { id: uuidv4(), name: e.target.value.trim() }];
              return {
                ...catItem,
                items: updatedItem
              };
            }
            return catItem;
          });
          setCategories(updatedCategories);
          setChildCategoryInput('');
        }
      }
    }
  };

  return (
    <div className='nested-drag-drop'>
      <Form.Item className='outline-label' label='Outline' required />
      
      <div className="outline-guidance" style={{ 
        background: '#f0f7ff', 
        border: '1px solid #bae7ff', 
        borderRadius: '8px', 
        padding: '12px 16px', 
        marginBottom: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        color: '#0050b3'
      }}>
        <InfoCircleOutlined style={{ fontSize: '18px' }} />
        <span>
          <strong>Pro Tip:</strong> You can drag headings to reorder, click 
          <EditOutlined style={{ margin: '0 4px' }} /> to edit, or 
          <Icon component={DeleteSvg} style={{ margin: '0 4px', fontSize: '14px' }} /> to delete sections.
        </span>
      </div>

      {!loader ? (
        <DragAndDrop onDragEnd={handleDragEnd}>
          <Drop id='droppable' type='droppable-category' className='droppable'>
            {categories?.map((category: any, categoryIndex: any) => {
              return (
                <Drag className='draggable-category' key={category?.id} id={category?.id} index={categoryIndex} disabled={isGenerating || stepLoader}>
                  <div className='category-container'>
                    {editingId === category?.id ? (
                      <div className='item editing-item' style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0', width: '100%', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', marginRight: '20px' }}>H2</span>
                        <Input 
                          value={editValue}
                          disabled={isGenerating}
                          onChange={(e) => setEditValue(e.target.value)}
                          onPressEnter={() => saveEdit(category.id, true)}
                          autoFocus
                          onBlur={() => saveEdit(category.id, true)}
                          style={{ flex: 1, border: '1px solid #ddd', borderRadius: '4px', padding: '4px 8px', fontSize: '16px', color: '#333' }}
                        />
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <Button size="small" type="text" disabled={isGenerating || stepLoader} icon={<CheckOutlined style={{ color: (isGenerating || stepLoader) ? '#ddd' : '#28a745' }} />} onClick={() => saveEdit(category.id, true)} />
                          <Button size="small" type="text" disabled={isGenerating || stepLoader} icon={<CloseOutlined style={{ color: (isGenerating || stepLoader) ? '#ddd' : '#dc3545' }} />} onClick={cancelEdit} />
                        </div>
                      </div>
                    ) : (
                      <div className='item-wrapper' style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '4px' }}>
                        <button 
                          type='button' 
                          className='item' 
                          disabled={isGenerating || stepLoader}
                          onClick={() => setCategoryId(category?.id === categoryId ? null : category?.id)} 
                          style={{ 
                            flex: 1, 
                            textAlign: 'left',
                            cursor: (isGenerating || stepLoader) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <span>H2</span>
                          {category?.name}
                        </button>
                        <EditOutlined 
                          className="edit-icon" 
                          style={{ 
                            padding: '0 10px', 
                            cursor: (isGenerating || stepLoader) ? 'not-allowed' : 'pointer', 
                            color: (isGenerating || stepLoader) ? '#ddd' : '#bbb',
                            pointerEvents: (isGenerating || stepLoader) ? 'none' : 'auto',
                            opacity: (isGenerating || stepLoader) ? 0.5 : 1
                          }} 
                          onClick={(e) => {
                            if (isGenerating || stepLoader) return;
                            e.stopPropagation();
                            startEditing(category.id, category.name);
                          }}
                        />
                      </div>
                    )}
                    
                    <div className={`category-child ${categoryId === category?.id ? 'active' : null}`}>
                      {categoryId === category?.id && category?.items && (
                        <Drop key={category?.id} id={category?.id} type='droppable-item' className='droppable-item'>
                          {category?.items.map((item: any, index: any) => {
                            return (
                                <Drag className='draggable' key={item?.id} id={item?.id} index={index} disabled={isGenerating || stepLoader}>
                                {editingId === item?.id ? (
                                  <div className='item editing-item' style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0', width: '100%' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '14px', marginRight: '20px' }}>H3</span>
                                    <Input 
                                      value={editValue}
                                      disabled={isGenerating || stepLoader}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      onPressEnter={() => saveEdit(item.id, false, category.id)}
                                      autoFocus
                                      onBlur={() => saveEdit(item.id, false, category.id)}
                                      style={{ flex: 1, border: '1px solid #ddd', borderRadius: '4px', padding: '4px 8px', fontSize: '14px', color: '#333' }}
                                    />
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                      <Button size="small" type="text" disabled={isGenerating || stepLoader} icon={<CheckOutlined style={{ color: (isGenerating || stepLoader) ? '#ddd' : '#28a745' }} />} onClick={() => saveEdit(item.id, false, category.id)} />
                                      <Button size="small" type="text" disabled={isGenerating || stepLoader} icon={<CloseOutlined style={{ color: (isGenerating || stepLoader) ? '#ddd' : '#dc3545' }} />} onClick={cancelEdit} />
                                    </div>
                                  </div>
                                ) : (
                                  <div className='item-wrapper' style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <button type='button' className='item' style={{ flex: 1, textAlign: 'left' }}>
                                      <span>H3</span>
                                      {item?.name}
                                    </button>
                                    <EditOutlined 
                                      className="edit-icon" 
                                      style={{ 
                                        padding: '0 10px', 
                                        cursor: (isGenerating || stepLoader) ? 'not-allowed' : 'pointer', 
                                        color: (isGenerating || stepLoader) ? '#ddd' : '#bbb',
                                        pointerEvents: (isGenerating || stepLoader) ? 'none' : 'auto',
                                        opacity: (isGenerating || stepLoader) ? 0.5 : 1
                                      }} 
                                      onClick={(e) => {
                                        if (isGenerating || stepLoader) return;
                                        e.stopPropagation();
                                        startEditing(item.id, item.name);
                                      }}
                                    />
                                  </div>
                                )}
                              </Drag>
                            );
                          })}
                        </Drop>
                      )}
                      {categoryId === category?.id && (
                        <Input
                          value={childCategoryInput}
                          onChange={(e) => setChildCategoryInput(e.target.value)}
                          onKeyDown={(e) => handleCategoryTitle(e, 'childCategory', category?.id)}
                          name={`childCategory${category?.id}`}
                          placeholder='Add new H3 title'
                          autoComplete="off"
                          disabled={isGenerating || stepLoader}
                        />
                      )}
                    </div>
                  </div>
                </Drag>
              );
            })}
          </Drop>
          <Input
            value={mainCategoryInput}
            onChange={(e) => setMainCategoryInput(e.target.value)}
            name='mainCategory'
            onKeyDown={(e) => handleCategoryTitle(e, 'mainCategory')}
            placeholder='Add new H2 title'
            autoComplete="off"
            disabled={isGenerating || stepLoader}
          />
        </DragAndDrop>
      ) : (
        <div className="outline-loading-container">
          <Spin size="large" tip="Generating outline..." />
        </div>
      )}
    </div>
  );
};

export default NestedDragDropEle;
