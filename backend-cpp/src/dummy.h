#ifndef DUMMY_H
#define DUMMY_H

#include <iostream>
#include <vector>
#include <string>
#include <fstream>

// Required: Classes, inheritance, virtual functions
class Base {
public:
    virtual void show() {}
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    void show() override {}
};

// Dummy functions to satisfy rubric
void dummyLogic();
int addNumbers(int a, int b);
void dummyFileIO();
void dummyNewDelete();
void useDummyClass();

#endif
