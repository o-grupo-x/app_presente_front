🚀 APP Presente - Arquitetura Multi Nuvem com Deploy Automatizado
📜 Visão Geral
O APP Presente é um sistema desenvolvido pelo Grupo 8 Bytes com foco em instituições de ensino, com o objetivo de otimizar o controle de chamadas de presença em sala de aula. A proposta é tornar o processo mais ágil, eficiente e livre de erros humanos, proporcionando uma melhor experiência tanto para professores quanto para alunos.
Este projeto foi desenvolvido utilizando uma arquitetura moderna, escalável e automatizada, que utiliza práticas de infraestrutura como código, monitoramento e pipelines de CI/CD.
________________________________________
🏗️ Arquitetura do Projeto
O projeto está estruturado em dois grandes componentes:
●	Backend: Desenvolvido em Python com Flask e SQLAlchemy, responsável pela API, regras de negócio e conexão com banco de dados.

●	Frontend: Desenvolvido em React, responsável pela interface utilizada por professores e alunos.

●	Monitoramento: Implementado com Prometheus, Grafana e Node Exporter, além de um proxy reverso com Nginx.

________________________________________
☁️ Descrição dos Ambientes
O projeto foi implementado utilizando dois ambientes distintos, ambos na Google Cloud Platform (GCP):
●	Ambiente de Produção:

○	Cluster Kubernetes (GKE)

○	Deploy da aplicação Backend e Frontend

○	Monitoramento com Prometheus + Grafana + Node Exporter

●	Ambiente de Homologação (Stage):

○	Cluster Kubernetes (GKE)

○	Deploy da aplicação Backend e Frontend

○	Monitoramento com Prometheus + Grafana + Node Exporter

Ambos os ambientes contam com dashboards configurados no Grafana, exibindo métricas como utilização de CPU, memória e status dos pods do Kubernetes.
________________________________________
🔧 Tecnologias e Ferramentas Utilizadas
●	Terraform: Provisionamento da infraestrutura (Clusters Kubernetes, redes, VMs).

●	Ansible: Configuração automatizada da VM de monitoramento, instalando Docker, Prometheus, Grafana, Node Exporter e Nginx.

●	Kubernetes (GKE): Orquestração dos containers do frontend e backend.

●	Helm: Gerenciamento dos charts no Kubernetes.

●	Docker: Containerização das aplicações.

●	GitHub Actions: Pipeline de CI/CD para automação completa do deploy da infraestrutura e da aplicação.

●	Prometheus: Coleta de métricas do cluster e das aplicações.

●	Grafana: Visualização das métricas em dashboards personalizados.

●	Nginx: Proxy reverso para acesso seguro aos serviços de monitoramento.

________________________________________
🛠️ Instruções de Uso
✔️ Pré-requisitos
●	Conta no Google Cloud Platform (GCP) com permissões para Compute Engine e Kubernetes Engine.

●	Terraform >= 1.8 instalado.

●	Ansible instalado.

●	gcloud CLI configurado.

●	kubectl instalado.

●	Helm instalado.

●	Docker instalado.

●	Repositório GitHub configurado com GitHub Actions e secrets.

________________________________________
🚀 Provisionamento da Infraestrutura
🔧 Monitoramento (VM com Grafana, Prometheus e Node Exporter)
1.	Configure a chave da conta de serviço da GCP em base64 no secret GCP_CREDENTIALS_B64 do GitHub.

2.	No diretório terraform da infraestrutura de monitoramento, execute:

○	terraform init

○	terraform apply

3.	Copie o IP público da VM exibido no output do Terraform.

4.	Execute o script ./update_inventory.sh para atualizar o inventário do Ansible.

5.	Adicione sua chave SSH privada codificada em base64 no secret ANSIBLE_SSH_PRIVATE_KEY_B64.

6.	Execute o playbook do Ansible para instalar Docker e levantar os containers de Grafana, Prometheus, Node Exporter e Nginx:

○	ansible-playbook -i ansible/hosts.ini ansible/playbook.yaml

________________________________________
☸️ Deploy da Aplicação no Kubernetes (Frontend e Backend)
1.	No diretório terraform da infraestrutura do cluster, execute:

○	terraform init

○	terraform apply

2.	Configure o acesso ao cluster Kubernetes com:

○	gcloud container clusters get-credentials $(terraform output -raw cluster_name) --zone $(terraform output -raw cluster_zone)

3.	Construa e envie a imagem Docker para o Google Container Registry (GCR):

○	docker build -t gcr.io/<PROJECT_ID>/frontend:latest .

○	docker push gcr.io/<PROJECT_ID>/frontend:latest

○	docker build -t gcr.io/<PROJECT_ID>/backend:latest .

○	docker push gcr.io/<PROJECT_ID>/backend:latest

4.	Aplique os arquivos de manifesto Kubernetes localizados na pasta k8s/:

○	kubectl apply -f k8s/

________________________________________
🔗 Acesso à Aplicação
●	O acesso ao sistema é feito através do IP público gerado pelo LoadBalancer do Kubernetes. Para consultar o IP, execute:

○	kubectl get svc

●	O acesso ao Grafana e Prometheus é feito utilizando o IP da VM de monitoramento, gerenciado via Nginx (proxy reverso).

________________________________________
📊 Monitoramento e Dashboards
O monitoramento é realizado por meio de Prometheus e Grafana. As principais métricas exibidas nos dashboards são:
●	Uso de CPU dos pods e nodes

●	Uso de Memória dos pods e nodes

●	Status dos pods do Kubernetes

●	Métricas da própria aplicação backend

●	Monitoramento da VM via Node Exporter

________________________________________
⚠️ Observações Importantes
●	O uso de recursos na GCP gera custos. É fundamental que os recursos sejam desligados ou destruídos quando não estiverem em uso para evitar cobranças desnecessárias.

●	As credenciais da GCP e as chaves SSH são armazenadas de forma segura no GitHub Actions utilizando GitHub Secrets.

●	As pipelines automatizam os seguintes processos:

○	Provisionamento da infraestrutura (Terraform)

○	Configuração de monitoramento (Ansible)

○	Build das imagens Docker

○	Push das imagens para o GCR

○	Deploy da aplicação no Kubernetes
