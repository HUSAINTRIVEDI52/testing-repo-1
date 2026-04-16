import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthHandler from "../../../src/components/AuthHandler/AuthHandler";

// Mocking localStorage with explicit types
const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
        getItem: function (key: string): string | null {
            return store[key] || null;
        },
        setItem: function (key: string, value: string): void {
            store[key] = value.toString();
        },
        clear: function (): void {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Correct approach to mock window.location.href
Object.defineProperty(window, "location", {
    value: {
        href: ''
    },
    writable: true
});

// Mock window.history.replaceState
window.history.replaceState = jest.fn();

describe("AuthHandler", () => {
    beforeEach(() => {
        localStorage.clear();
        window.location.href = '';
    });

    it("should store token and userId in localStorage and navigate to home if token is present", () => {
        render(
            <MemoryRouter initialEntries={["/auth?token=123&userId=abc"]}>
                <Routes>
                    <Route path="/auth" element={<AuthHandler />} />
                </Routes>
            </MemoryRouter>
        );

        expect(localStorage.getItem("accessToken")).toBe("123");
        expect(localStorage.getItem("userId")).toBe("abc");
        expect(window.location.href).toBe("/");
    });

    it("should redirect to login if token is not present", () => {
        render(
            <MemoryRouter initialEntries={["/auth"]}>
                <Routes>
                    <Route path="/auth" element={<AuthHandler />} />
                </Routes>
            </MemoryRouter>
        );

        expect(window.location.href).toBe("/login");
    });
});