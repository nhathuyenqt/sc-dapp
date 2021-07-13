n = 10
from charm.toolbox.integergroup import IntegerGroup

group1 = IntegerGroup()
group1.paramgen(1024)
group2 = IntegerGroup()
group2.paramgen(1024)

g_vec = []
h_vec = []
for i in range(n):
    g_vec.append(group1.randomGen())
    h_vec.append(group2.randomGen())

print(g_vec)
print()
print(h_vec)



