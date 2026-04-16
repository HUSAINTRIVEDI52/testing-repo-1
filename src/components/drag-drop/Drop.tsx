import React from 'react';
import { Droppable } from "react-beautiful-dnd";

const Drop = ({ id, type, ...props }: any) => {
    return (
        <Droppable droppableId={id} type={type}>
            {(provided: any) => {
                return (
                    <div ref={provided.innerRef} {...provided.droppableProps} {...props}>
                        {props?.children}
                        {provided?.placeholder}
                    </div>
                );
            }}
        </Droppable>
    );
};

export default Drop;