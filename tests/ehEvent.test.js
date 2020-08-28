import { EhEvent, expect } from './test-kit';

describe("EhEvent", function () {

    class Employee {
        /**
         * 
         * @param {string} name 
         * @param {number} age 
         */
        constructor(name, age) {
            this.name = name;
            this.age = age;
            this.isWorking = false;
        }
    }

    it("basic test", function (done) {
        const employeeDan = new Employee('Dan', 99);
        const employeeBirthdayEvent = EhEvent.fromClass(Employee);
        employeeBirthdayEvent.register(employee => {
            employee.age++;
            console.log(`Congrats ${employee.name}! You are now ${employee.age} years old.`);
        });

        Promise.all(new Array(5).fill(0).map(() => employeeBirthdayEvent.fire(employeeDan)))
        .then(([employee]) => {
            expect(employee.age).to.be.equal(104);
            done();
        });
    });

    it("registerOnce test", function (done) {
        const employeeDan = new Employee('Dan', 99);
        const employeeBirthdayEvent = EhEvent.fromClass(Employee);
        employeeBirthdayEvent.registerOnce(employee => {
            employee.age++;
            console.log(`Congrats ${employee.name}! You are now ${employee.age} years old.`);
        });

        Promise.all(new Array(5).fill(0).map(() => employeeBirthdayEvent.fire(employeeDan)))
        .then(([employee]) => {
            expect(employee.age).to.be.equal(100);
            done();
        });
    });

});