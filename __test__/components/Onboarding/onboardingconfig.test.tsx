import React from "react";
describe('onboardingConfigs', () => {
    const onboardingConfigs = [
        {
            id: 1,
            heading: "Who are you?",
            data: ["Individual", "Organisation"]
        },
        {
            id: 2,
            heading: "What is your role?",
            data: ["Business Owner", "Employee", "Content Writer", "Manager", "SEO Specialist", "other"],
        },
        {
            id: 3,
            heading: "How did you here about us?",
            data: ["Google", "Word of Mouth", "Email", "Social Media", "Blog/Article", "Other"],
        }
    ];

    test('contains the correct number of configurations', () => {
        expect(onboardingConfigs).toHaveLength(3);
    });

    test('each configuration has id, heading, and data properties', () => {
        onboardingConfigs.forEach(config => {
            expect(config).toHaveProperty('id');
            expect(config).toHaveProperty('heading');
            expect(config).toHaveProperty('data');
            expect(typeof config.id).toBe('number');
            expect(typeof config.heading).toBe('string');
            expect(Array.isArray(config.data)).toBe(true);
        });
    });

    test('validates specific properties of configurations', () => {
        // Example: Validate the second configuration
        const secondConfig = onboardingConfigs[1];
        expect(secondConfig.id).toBe(2);
        expect(secondConfig.heading).toBe("What is your role?");
        expect(secondConfig.data).toEqual(["Business Owner", "Employee", "Content Writer", "Manager", "SEO Specialist", "other"]);
    });


});