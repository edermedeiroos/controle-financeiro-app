package br.com.projeto.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import br.com.projeto.model.Categoria;
import br.com.projeto.model.Transacao;
import br.com.projeto.model.enums.TipoTransacao;
import br.com.projeto.repository.CategoriaRepository;
import br.com.projeto.repository.TransacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class TransacaoService {

    private static final Set<String> CAMPOS_PERMITIDOS = Set.of("data", "valor", "descricao", "id");

    private final TransacaoRepository transacaoRepository;
    private final CategoriaRepository categoriaRepository;

    public TransacaoService(TransacaoRepository transacaoRepository, CategoriaRepository categoriaRepository) {
        this.transacaoRepository = transacaoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    private Sort criarOrdenacao(String campo, String direcao) {
        String campoOrdenacao = (campo != null && CAMPOS_PERMITIDOS.contains(campo)) ? campo : "data";
        Sort.Direction direction = "asc".equalsIgnoreCase(direcao) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(direction, campoOrdenacao);
    }

    private Categoria resolverCategoria(Transacao transacao) {
        if (transacao.getCategoria() == null || transacao.getCategoria().getId() == null) {
            throw new IllegalArgumentException("A categoria é obrigatória.");
        }
        Long categoriaId = transacao.getCategoria().getId();
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria com ID " + categoriaId + " não encontrada."));
    }

    public List<Transacao> listarTodas(String campo, String direcao) {
        return transacaoRepository.findAll(criarOrdenacao(campo, direcao));
    }

    public List<Transacao> buscarPorDescricao(String descricao, String campo, String direcao) {
        Sort sort = criarOrdenacao(campo, direcao);
        if (descricao != null && !descricao.trim().isEmpty()) {
            return transacaoRepository.findByDescricaoContainingIgnoreCase(descricao.trim(), sort);
        }
        return transacaoRepository.findAll(sort);
    }

    public Transacao buscarPorId(Long id) {
        return transacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transação com ID " + id + " não encontrada."));
    }

    public Transacao salvar(Transacao transacao) {
        transacao.setCategoria(resolverCategoria(transacao));
        transacao.setAtivo(true);
        return transacaoRepository.save(transacao);
    }

    public Transacao atualizar(Long id, Transacao dados) {
        Transacao existente = buscarPorId(id);
        existente.setDescricao(dados.getDescricao());
        existente.setValor(dados.getValor());
        existente.setData(dados.getData());
        existente.setTipo(dados.getTipo());
        existente.setCategoria(resolverCategoria(dados));
        existente.setObservacao(dados.getObservacao());
        return transacaoRepository.save(existente);
    }

    public void excluir(Long id) {
        if (!transacaoRepository.existsById(id)) {
            throw new EntityNotFoundException("Transação com ID " + id + " não encontrada.");
        }
        transacaoRepository.deleteById(id);
    }

    public BigDecimal calcularTotalReceitas() {
        return transacaoRepository.findAll().stream()
                .filter(t -> t.getTipo() == TipoTransacao.RECEITA)
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal calcularTotalDespesas() {
        return transacaoRepository.findAll().stream()
                .filter(t -> t.getTipo() == TipoTransacao.DESPESA)
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal calcularSaldo() {
        return calcularTotalReceitas().subtract(calcularTotalDespesas());
    }
}
