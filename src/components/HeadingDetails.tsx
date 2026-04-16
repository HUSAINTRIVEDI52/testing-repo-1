// HeadingDetails.tsx
import React, { useContext } from 'react';
import { GlobalContext } from "../Context";

function HeadingDetails() {
    const { currentHeading, headings, details, handleNext, handleBack }: any = useContext(GlobalContext);

    return (
        <div>
            <section>
                <h2>Headings</h2>
                <ul>
                    {headings.map((heading: any) => (
                        <li key={heading.id}>{heading.title}</li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Details</h2>
                <p>{details[currentHeading].content}</p>
                <button onClick={handleBack} disabled={currentHeading === 0}>
                    Back
                </button>
                <button onClick={handleNext} disabled={currentHeading === headings.length - 1}>
                    Next
                </button>
            </section>
        </div>
    );
}

export default HeadingDetails;