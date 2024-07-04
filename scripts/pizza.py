import matplotlib.pyplot as plt
import requests
import os


try:
    response = requests.get('http://localhost:3000/api/users-per-profile')
    response.raise_for_status() 
except requests.exceptions.RequestException as e:
    print(f"Erro ao fazer requisição para a API: {e}")
    exit(1)

try:
    data = response.json()
except ValueError as e:
    print(f"Erro ao decodificar a resposta JSON: {e}")
    exit(1)

if isinstance(data, list) and all(isinstance(i, dict) for i in data):
    labels = [item['nomeperfil'] for item in data]
    sizes = [item['count'] for item in data]

    fig1, ax1 = plt.subplots()
    ax1.pie(sizes, labels=labels, autopct='%1.1f%%', shadow=True, startangle=90)
    ax1.axis('equal')

    output_dir = os.path.join('public', 'images')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Diretório criado: {output_dir}")

    output_path = os.path.join(output_dir, 'pie_chart.png')
    plt.savefig(output_path)
    print(f"Gráfico salvo em: {output_path}")
    plt.close(fig1)  
else:
    print("Erro: Dados da API não estão no formato esperado")
