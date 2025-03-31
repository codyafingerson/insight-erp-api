import { test, expect } from "bun:test";
import { redisClient } from "../../../src/config/database/redis";

// Test the "connect" event logging.
test("redisClient emits 'connect' and logs correctly", () => {
    const originalLog = console.log;
    let logged: any[] = [];
    console.log = (...args: any[]) => {
        logged = args;
    };

    // Emit the connect event manually.
    redisClient.emit("connect");
    
    expect(logged).toEqual(["Connected to Redis"]);

    // Restore console.log.
    console.log = originalLog;
});

// Test the "error" event logging.
test("redisClient emits 'error' and logs correctly", () => {
    const originalError = console.error;
    let logged: any[] = [];
    console.error = (...args: any[]) => {
        logged = args;
    };

    // Create an error instance and emit the error event.
    const error = new Error("Test error");
    redisClient.emit("error", error);
    
    expect(logged).toEqual(["Redis error:", error]);

    // Restore console.error.
    console.error = originalError;
});