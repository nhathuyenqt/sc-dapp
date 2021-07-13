# Calculator - Example for illustrative purposes only.

import smartpy as sp

class YContract(sp.Contract):
    def __init__(self):
        self.init(value = 0, greet = "")

    @sp.entry_point
    def sayHello(self, _greet):
        print(_greet)
        self.greet = _greet
        # print(sp.sender)

    @sp.entry_point
    def bye(self):
       	return self.greet

if "templates" not in __name__:
    @sp.add_test(name = "YContract")
    def test():
        alice = sp.test_account("Alice").address
        bob   = sp.test_account("Robert")
        c1 = YContract()
        c1.sayHello(_greet = "Helloword")
        # .run(sender = alice)