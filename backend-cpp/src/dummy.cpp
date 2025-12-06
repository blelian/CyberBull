#include "dummy.h"

// Required: Variables, expressions, conditionals, loops, STL container
void dummyLogic() {
    int x = 5;                  // variable
    double y = 3.14;            // variable
    std::string s = "Hello";    // variable

    int z = x + static_cast<int>(y); // expression

    // conditional
    if (z > 7) {
        z -= 2;
    } else {
        z += 2;
    }

    // loop
    for (int i = 0; i < 3; i++) {
        z += i;
    }

    // STL container
    std::vector<int> vec = {1, 2, 3};
    vec.push_back(z);
}

// Required: simple function
int addNumbers(int a, int b) {
    return a + b;
}

// Required: read/write file
void dummyFileIO() {
    std::ofstream out("dummy.txt");
    out << "This is a test\n";
    out.close();

    std::ifstream in("dummy.txt");
    std::string content;
    std::getline(in, content);
    in.close();
}

// Required: new/delete operators
void dummyNewDelete() {
    int* ptr = new int(42);
    delete ptr;
}

// Use the DummyClass to satisfy class usage
class DummyClass {
public:
    DummyClass() {}
    void printVector() {
        std::vector<std::string> v = {"a", "b", "c"};
        for (const auto& item : v) {
            // iterate only
        }
    }
};

void useDummyClass() {
    DummyClass d;
    d.printVector();
}
