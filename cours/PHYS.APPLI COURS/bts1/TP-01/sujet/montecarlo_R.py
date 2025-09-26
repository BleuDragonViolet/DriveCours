import numpy as np
import matplotlib.pyplot as plt

U_lue = ….. #Volt
I_lue = ….. #Ampère

u_U = ….. #Volt
u_I = ….. #Ampère

# Génération de N valeurs aléatoires possibles pour U et I
N= …..
U = np.random.normal(U_lue, u_U, N)
I = np.random.normal(I_lue, u_I, N)

#Affichage des histogrammes pour U et I
plt.figure(0)
plt.hist(U,bins='rice')
plt.xlabel('U (V)')
plt.ylabel('N')

plt.figure(1)
plt.hist(I,bins='rice')
plt.xlabel('I (A)')
plt.ylabel('N')

# Calculs des valeurs possibles pour R:

R = U/I

moy = np.mean(R)
u_R = np.std(R)

print('R=', round(moy) , '+/-', round(u_R), 'Ohms')

plt.figure(2)
plt.hist(R,bins='rice')
plt.xlabel('R ($\Omega$)')
plt.ylabel('N')

plt.show()



