import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tooltip } from 'primereact/tooltip'; 
import Header from "../components/Header";
import Listagem from "../components/Listagem";
import Modal from "../components/Modal";
import { useNavigate, useParams } from 'react-router-dom'; 
import apiVestibulizeClient from "../utils/apiVestibulizeClient";
import InputTextArea from "../components/InputTextArea";

const Anotacao = () => {

    const navigate = useNavigate();
    const { notebook_id } = useParams();

    const [filtro, setFiltro] = useState("");
    const [anotacoes, setAnotacoes] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnotacao, setEditingAnotacao] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [anotacao, setAnotacao] = useState("");
    const [pergunta, setPergunta] = useState("");
    const [sumario, setSumario] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingAnotacao, setViewingAnotacao] = useState(null);

    useEffect(() => {
        getAnotacoes();
    }, []);

    const getAnotacoes = async () => {

        const params = filtro.trim().length > 3 ? { search: filtro.trim() } : {};

        const response = await apiVestibulizeClient.get(`notebook/${notebook_id}/notes`, { 
            headers: {
                token: `${localStorage.getItem('token')}` 
            },
            params: params
        }).catch(error => {
            alert("Erro ao buscar anotacoes. Tente novamente.");
        });
        
        setAnotacoes(response.data.map((item) => ({
            data: item.created_at === null ? null : new Date(item.created_at).toLocaleDateString("pt-BR"),
            titulo: item.title,
            anotacao: item.content,
            pergunta: item.questions,
            sumario: item.summary,
            id: item.id
        })))
    }

    const handleOpenModal = (item = null) => {
        setIsViewModalOpen(false);
        setEditingAnotacao(item);
        setTitulo(item ? item.titulo : "");
        setAnotacao(item ? item.anotacao : "");
        setPergunta(item ? item.pergunta : "");
        setSumario(item ? item.sumario : "");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAnotacao(null);
        setTitulo("");
        setAnotacao("");
        setPergunta("");
        setSumario("");
    };
    
    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingAnotacao(null);
    }

    const handleSave = async () => {
        if (!titulo.trim()) {
            alert("O título é obrigatório!");
            return;
        }
        const dados = {
            id: editingAnotacao ? editingAnotacao.id : null,
            title:titulo,
            notebook_id: notebook_id,
            content: anotacao,
            questions: pergunta,
            summary: sumario,
        };

        if (editingAnotacao) {
            
            apiVestibulizeClient.put('note/' + dados.id, dados, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(response => {
                alert("Anotacao atualizada com sucesso!");
                getAnotacoes();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                alert("Erro ao atualizar anotacao. Tente novamente.");
            }).finally(() => {
                handleCloseModal();
            });

        } else {

             apiVestibulizeClient.post('note', dados, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(response => {
                alert("Anotacao criada com sucesso!");
                getAnotacoes();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                alert("Erro ao criar anotacao. Tente novamente.");
            }).finally(() => {
                handleCloseModal();
            });

        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta anotação?")) {
            apiVestibulizeClient.delete('note/' + id, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(response => {
                    alert("Anotacao excluída com sucesso!");
                getAnotacoes();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                alert("Erro ao excluir anotacao. Tente novamente.");
            });
        }
    };

    const formStyles = {
        input: {
            width: '100%',
            borderRadius: '8px',
            backgroundColor: '#2e2e42',
            border: '1px solid #4a4a60',
            color: '#e0e0e0',
            padding: '12px 15px',
        },
        button: {
            width: '100%',
            padding: '12px 0',
            borderRadius: '8px',
            backgroundColor: '#46397d',
            border: 'none',
            color: '#e0e0e0',
            marginTop: '15px',
            fontWeight: 'bold',
            letterSpacing: '1px',
        },
    };

    const iconStyle = {
        marginLeft: '8px',
        color: '#977acfff',
        cursor: 'help',
        fontSize: '0.7em',
    };


    const modalFormJSX = (
        <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            style={{ display: "flex", flexDirection: "column" }}
        >
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="titulo" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Título</label>
                    <i id="tooltip-icon-titulo" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip 
                        target="#tooltip-icon-titulo" 
                        content="Seção para o nome do curso, tema, data, etc." 
                        position="top" 
                    />
                </div>
                <InputText
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    style={formStyles.input}
                    autoFocus
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="anotacao" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Anotação</label>
                    <i id="tooltip-icon-anotacao" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip 
                        target="#tooltip-icon-anotacao" 
                        content="Seção para as anotações com conceitos e ideias principais." 
                        position="top" 
                    />
                </div>
                <InputTextArea
                    id="anotacao"
                    value={anotacao}
                    onChange={(e) => setAnotacao(e.target.value)}
                    style={formStyles.input}
                    autoFocus
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="pergunta" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Perguntas</label>
                    <i id="tooltip-icon-pergunta" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip 
                        target="#tooltip-icon-pergunta" 
                        content="Seção para revisão destinada para palavras chaves para lembrar do conteúdo." 
                        position="top" 
                    />
                </div>
                <InputText
                    id="pergunta"
                    value={pergunta}
                    onChange={(e) => setPergunta(e.target.value)}
                    style={formStyles.input}
                    autoFocus
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="sumario" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Sumário</label>
                    <i id="tooltip-icon-sumario" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip 
                        target="#tooltip-icon-sumario" 
                        content="Seção para resumir o que foi entendido sobre o conteúdo." 
                        position="top" 
                    />
                </div>
                <InputText
                    id="sumario"
                    value={sumario}
                    onChange={(e) => setSumario(e.target.value)}
                    style={formStyles.input}
                    autoFocus
                />
            </div>

            <Button
                label={editingAnotacao ? "ATUALIZAR" : "ADICIONAR"}
                style={formStyles.button}
            />
        </form>
    );

    const viewModalJSX = viewingAnotacao && (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            color: '#e0e0e0'
        }}>
            <p style={{ margin: 0, fontSize: '1em', color: '#c0c0c0' }}>
                Data: {viewingAnotacao.data}
            </p>
        </div>
    );

    const createCardActionsGenerator = (anotacao) => (
        <>
            <Button 
                icon="pi pi-pencil" 
                className="p-button-text p-button-sm" 
                style={{ color: '#ffbc3fff' }} 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    handleOpenModal(anotacao); 
                }} 
            />
            <Button 
                icon="pi pi-trash" 
                className="p-button-text p-button-sm" 
                style={{ color: '#e05a2eff' }} 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDelete(anotacao.id); 
                }} 
            />
        </>
    );

    const handleFilterSearch = (e) => {
        setFiltro(e.target.value);

        if(e.target.value.length > 3) {
            getAnotacoes();
        }
    }

    return (
        <main style={{ background: 'linear-gradient(180deg, #F9F9F9 0%, #E6E9F0 100%)', minHeight: '100vh', width: '100%' }}>
            <Header
                title="Anotações"
                searchText={filtro}
                onSearchChange={(e) => handleFilterSearch(e)}
                onAddClick={() => handleOpenModal()}
                searchPlaceholder="Pesquisar por título."
                addButtonLabel= "Adicionar Anotação"
            />

            <section style={{ padding: "0 20px", maxWidth: "1000px", margin: "30px auto" }}>
                <Listagem
                    listagem={anotacoes}
                    headerTitle="Título/Data"
                    headerActions="Ações"
                    cardActionsGenerator={createCardActionsGenerator}
                />
            </section>

             <Modal
                 isOpen={isModalOpen}
                 onClose={handleCloseModal}
                 title={editingAnotacao ? "Atualizar - Anotação" : "Adicionar - Anotação"}
             >
                 {modalFormJSX}
             </Modal>

             <Modal
                 isOpen={isViewModalOpen}
                 onClose={handleCloseViewModal}
                 title={viewingAnotacao ? `Visualizar - ${viewingAnotacao.titulo}` : "Visualizar Anotação"}
             >
                 {viewModalJSX}
             </Modal>
        </main>
    );
};

export default Anotacao;